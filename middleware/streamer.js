//Exports
var fs = require('fs'),
	request = require('request'),
//	throttle = require('throttle'),
	throttle = require('throttled-stream'),
	EventEmitter = require('events').EventEmitter,
	config = require('../config'),
	util = require('util');

var clients = [];

var Streamer = function () {
	if(!(this instanceof Streamer)) {
		return new Streamer();
	}

	this.getRemoteFileStream = function (url) {
		return request(url);
	};

	this.getLocalFileStream = function (path) {
		return fs.createReadStream(path);
	};

	this.broadcast = function (data) {
		clients.forEach(function (client) {
			client.write(data);
		});
	};

	this.registerClient = function (client) {
		clients.push(client);
		client.on('closed', function () {
			var position = clients.indexOf(client);
			if(position !== -1) {
				console.log('Remove client from clients list');
				clients.splice(position, 1);
			}
		});
	};

	this.getClients = function () {
		return clients;
	};

	this.play = function (url) {
		console.log('play');
		var stream = this.getRemoteFileStream(url);

		console.log('Start streaming');
//		var t = new throttle(config.get('streaming:bitRate'));

//		var unthrottle = stream.pipe(t);
		var unthrottle = throttle(stream, config.get('streaming:bitRate'));
		unthrottle.on('data', function (data) {
			this.broadcast(data);
		}.bind(this));

		unthrottle.on('end', function () {
			console.log('Stream ended', this);
			this.emit('end');
		}.bind(this));
	};
};

util.inherits(Streamer, EventEmitter);

module.exports = Streamer;