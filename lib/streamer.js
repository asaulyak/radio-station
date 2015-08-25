//Exports
var fs = require('fs');
var request = require('request');
var Throttle = require('throttle');
var EventEmitter = require('events').EventEmitter;
var extend = require('extend');
var logger = require('./../middleware/logger');


var Streamer = function () {
	if (!(this instanceof Streamer)) {
		return new Streamer();
	}
};

Streamer.prototype = {
	_clients: [],

	getRemoteFileStream: function (url) {
		return request(url);
	},

	getLocalFileStream: function (path) {
		return fs.createReadStream(path);
	},

	stop: function () {
		logger.debug('Stop streaming');
		this._clients.forEach(function (client) {
			client.end();
		});
		this._clients = [];
	},

	play: function (track) {
		logger.debug('Play track', track.url);
		var stream = null;
		try {
			stream = this.getRemoteFileStream(track.url);
			this._currentTrack = track;
		}
		catch (e) {
			logger.error('Can\'t open url', track.url);
			this.emit('end');
			return;
		}

		logger.debug('Start streaming');

		stream = stream.pipe(new Throttle(track.bitRate));

		stream.on('data', this.emit.bind(this, 'data'));

		stream.on('end', function () {
			logger.debug('Stop streaming track');
			this._currentTrack = null;
			this.emit('end');
		}.bind(this));
	}
};

extend(Streamer.prototype, EventEmitter.prototype);

module.exports = Streamer;