//Exports
var fs = require('fs'),
	request = require('request'),
	throttle = require('throttle'),
	EventEmitter = require('events').EventEmitter,
	config = require('../config');

var streamer = new EventEmitter();

var clients = [];

//	var encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
//	encoder.on("data", function (data) {
//		broadcast(data);
//	});
//	var decoder = lame.Decoder();
//	decoder.on('format', function (format) {
//		console.log('decode data', format);
//		decoder.pipe(encoder);
//	});

streamer.getRemoteFileStream = function (url) {
	return request(url);
};

streamer.getLocalFileStream = function (path) {
	return fs.createReadStream(path);
};

streamer.broadcast = function (data) {
	clients.forEach(function (client) {
		client.write(data);
	});
};

streamer.registerClient = function (client) {
	clients.push(client);
	client.on('closed', function () {
		var position = clients.indexOf(client);
		if(position !== -1) {
			console.log('Remove client from clients list');
			clients.splice(position, 1);
		}
	});
};

streamer.play = function (url) {
	console.log('play');
	var stream = this.getRemoteFileStream(url);

	console.log('Start streaming');
	var t = new throttle(config.get('streaming:bitRate'));

	var unthrottle = stream.pipe(t);
	unthrottle.on('data', function (data) {
		this.broadcast(data);
	}.bind(this));

	unthrottle.on('end', function () {
		console.log('Stream ended', this);
		this.emit('end');
	}.bind(this));
};

module.exports = streamer;