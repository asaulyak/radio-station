//Exports
var fs = require('fs'),
	request = require('request'),
	Throttle = require('throttle'),
	EventEmitter = require('events').EventEmitter,
	config = require('../config'),
	util = require('util'),
	logger = require('./../middleware/logger');


var Streamer = function () {
	if(!(this instanceof Streamer)) {
		return new Streamer();
	}

	this._clients = [];

	this.getRemoteFileStream = function (url) {
		return request(url);
	};

	this.getLocalFileStream = function (path) {
		return fs.createReadStream(path);
	};


	this.stop = function () {
		logger.debug('Stop streaming');
		this._clients.forEach(function (client) {
			client.end();
		});
		this._clients = [];
	};

	this.play = function (track) {
		logger.debug('Play track', track.url);
		var stream = null;
		try {
			stream = this.getRemoteFileStream(track.url);
			this._currentTrack = track;
		}
		catch(e) {
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
	};
};

util.inherits(Streamer, EventEmitter);

module.exports = Streamer;