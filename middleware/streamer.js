//Exports
var fs = require('fs'),
	request = require('request'),
	Throttle = require('throttle'),
	EventEmitter = require('events').EventEmitter,
	config = require('../config'),
	util = require('util');


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
		client.on('closed', function () {
			var position = this._clients.indexOf(client);
			if(position !== -1) {
				console.log('Remove client from clients list');
				this._clients.splice(position, 1);
			}
		}.bind(this));
	};

	this.getClients = function () {
		return this._clients;
	};

	this.stop = function () {
		this._clients = [];
	};

	this.play = function (url) {
		console.log('play');
		var stream = this.getRemoteFileStream(url);

		console.log('Start streaming');

		stream = stream.pipe(new Throttle(config.get('streaming:bitRate')));

		stream.on('data', function (data) {
			this.broadcast(data);
		}.bind(this));

		stream.on('end', function () {
			this.emit('end');
		}.bind(this));
	};
};

util.inherits(Streamer, EventEmitter);

module.exports = Streamer;