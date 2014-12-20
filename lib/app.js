var config = require('./../config/index'),
	Channel = require('./channel'),
	async = require('async'),
	mediaSources = require('./mediaSources'),
	guid = require('./../middleware/guid'),
	logger = require('./../middleware/logger');


function App(config) {
	"use strict";

	if (!(this instanceof App)) {
		return new App();
	}

	// Properties
	this._channels = {};

	//Public methods

	/**
	 * Get stream of a channel
	 * @param {object} req Request object
	 * @param {object} res Response object
	 */
	this.listenChannel = function (req, res) {
		var uid = req.params.uid;
		logger.debug('Play channel', uid);

		var channel = channels[uid];
		if (channel) {
			res.writeHead(200, {
				'Content-Type': 'audio/mpeg'
			});

			channel.join(res);
		}
		else {
			res.status(404);
			res.end();
		}
	};

	/**
	 * Create an instance of a channel
	 * @param {object} req Request object
	 * @param {object} res Response object
	 */
	this.createChannel = function (req, res) {
		logger.debug('Create channel', req.params.name);
		var uid = guid();
		this._channels[uid] = new Channel(req.params.name);

		res.json({uid: uid});
		res.end();
	};

	/**
	 * Remove a channel from channels list
	 * @param {object} req Request object
	 * @param {object} res Response object
	 */
	this.deleteChannel = function (req, res) {
		var uid = req.params.uid,
			channel = channels[uid];
		if (channel) {
			channel.stop();
			channel = null;
			res.json({uid: uid});
		}
		else {
			res.status(400);
			res.json({
				error: 'Channel does not exist.'
			});
		}

		res.end();
	};

	/**
	 * Start a channel
	 * @param {object} req Request object
	 * @param {object} res Response object
	 */
	this.startChannel = function (req, res) {
		var uid = req.params.uid,
			channel = this._channels[uid];
		if (channel) {
			channel.start();
			res.json({uid: uid});
		}
		else {
			res.status(400);
			res.json({
				error: 'Channel does not exist.'
			});
		}

		res.end();
	};

	/**
	 * Add track to a channels track list
	 * @param {object} req Request object
	 * @param {object} res Response object
	 */
	this.addTrackToChannel = function (req, res) {
		logger.debug('uid', req.params.uid, req.body);
		var channel = channels[req.params.uid];
		if (channel) {
			var engine = mediaSources.getEngine(req.body.engine);

			engine.getTrack(req.body.id, function (err, track) {
				if (!err) {
					channel.addTrack(track);
					res.write(track.url);
				}
				else {
					logger.error('Error occurred while adding a track', req.body.engine, req.body.id, 'to channel', req.params.uid);
					res.write('Error occurred while adding a track');
				}
			});
		}
		else {
			logger.error('Channel', req.params.uid, 'does not exist.');
			res.status(400);
			res.write('Channel does not exist.');
		}
		res.end();
	};

	/**
	 * Search track by key words
	 * @param {String} query Key words to search
	 * @param {Function} callback
	 */
	this.searchTrack = function (query, callback) {
		query = query || '';

		// Create array of tasks to be ran for each media source
		var tasks = mediaSources.getEngines().map(function (source) {
			return function (callback) {
				source.searchMusic(encodeURIComponent(query), callback);
			}
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
	};
}

module.exports = new App(config);
