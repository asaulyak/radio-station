var config = require('./../config/index');
var Channel = require('./channel');
var async = require('async');
var mediaSources = require('./mediaSources');
var guid = require('./../middleware/guid');
var logger = require('./../middleware/logger');


/**
 * Class that encapsulates common application logic
 * @class
 */
function App(config) {
	'use strict';

	if (!(this instanceof App)) {
		return new App(config);
	}

	// Properties
	this._channels = {};
}

//Public methods
App.prototype = {

	/**
	 * Gets called after corresponding operation is complete.
	 * @callback App~appOperationCompleteCallback
	 * @param {object} error - Information about the error.
	 * @param {object} data - Information with success message.
	 * @return undefined
	 */

	/**
	 * Get stream of a channel
	 * @param {String} uid Channel's id
	 */
	getChannel: function (uid) {
		return this._channels[uid];
	},

	/**
	 * Create an instance of a channel
	 * @param {String} name Name of a channel
	 */
	createChannel: function (name) {
		logger.debug('Create channel', name);
		var uid = guid();
		this._channels[uid] = new Channel({
			id: uid,
			name: name
		});

		return uid;
	},

	/**
	 * Remove a channel from channels list
	 * @param {String} uid Channel's id,
	 * @param {App~appOperationCompleteCallback} callback Is called when channel is deleted
	 */
	deleteChannel: function (uid, callback) {
		var channel = this._channels[uid];

		if (channel) {
			channel.stop();
			channel = null;

			callback(null, {
				uid: uid
			});
		}
		else {
			callback({
				error: 'Channel does not exist.'
			});
		}
	},

	/**
	 *  Start a channel
	 * @param {String} uid Channel's id
	 * @param {App~appOperationCompleteCallback} callback Is called when channel is added
	 */
	startChannel: function (uid, callback) {
		var channel = this._channels[uid];

		if (channel) {
			channel.start();

			// TODO: Pass more useful information
			callback(null, {
				uid: uid
			});
		}
		else {
			callback({
				error: 'Channel does not exist.'
			});
		}
	},

	/**
	 * Add track to a channels track list.
	 * @param {object} data Information about the track.
	 * @param {String} data.uid Channel's id.
	 * @param {Number} data.trackId Track id.
	 * @param {String} data.engineId Search engine ('sc', 'vk').
	 * @param {App~appOperationCompleteCallback} callback Is called when track is added.
	 */
	addTrackToChannel: function (data, callback) {
		var channel = this._channels[data.uid];
		if (channel) {
			var engine = mediaSources.getEngine(data.engineId);

			engine.getTrack(data.trackId, function (error, track) {
				if (error) {
					logger.error('Error occurred while adding a track', engine, data.trackId, 'to channel', data.uid);

					callback({
						error: error
					});
				}
				else {
					channel.addTrack(track);
					callback(null, {
						message: track.url
					});
				}
			});
		}
		else {
			logger.error('Channel', data.uid, 'does not exist.');
			callback({
				error: 'Channel' + data.uid + ' does not exist.'
			});
		}
	},

	/**
	 * Search track by key words
	 * @param {String} query Key words to search
	 * @param {App~appOperationCompleteCallback} callback Function to be executed when search results are ready
	 */
	searchTracks: function (query, callback) {
		query = query || '';

		// Create array of tasks to be ran for each media source
		var tasks = mediaSources.getEngines().map(function (source) {
			return function (callback) {
				source.searchMusic(encodeURIComponent(query), callback);
			};
		});

		// Run music search in parallel
		async.parallel(tasks,
			function (err, results) {
				if (err) {
					callback(err);
					return;
				}

				// Merge arrays of results
				results = [].concat.apply([], results);

				callback(null, results);
			});
	},

	/**
	 * Get metadata info about current track in channel.
	 * @param {String} channelId ID of the channel
	 * @returns {Object}
	 */
	getChannelMetadata: function (channelId) {
		var channel = this._channels[channelId];

		if (channel) {
			return channel.getMetadata();
		}
	}
};

module.exports = new App(config);
