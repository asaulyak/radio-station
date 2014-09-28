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

	this.broadcast = function (data) {
		this._clients.forEach(function (client) {
			client.write(data);
		});
	};

	this.registerClient = function (client) {
		this._clients.push(client);
		logger.debug('add client', this._clients.length);
		client.on('closed', function () {
			logger.debug('Client disconnected');
			var position = this._clients.indexOf(client);
			if(position !== -1) {
				logger.debug('Remove client from clients list');
				this._clients.splice(position, 1);
			}
		}.bind(this));
	};

	this.getClients = function () {
		return this._clients;
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
		}
		catch(e) {
			logger.error('Can\'t open url', track.url);
			this.emit('end');
			return;
		}

		logger.debug('Start streaming');

		stream = stream.pipe(new Throttle(track.bitRate));

		stream.on('data', function (data) {
			this.broadcast(data);
		}.bind(this));

		stream.on('end', function () {
			logger.debug('Stop streaming track');
			this.emit('end');
		}.bind(this));
	};
};

util.inherits(Streamer, EventEmitter);

module.exports = Streamer;