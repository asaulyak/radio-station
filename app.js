var express = require('express'),
	fs = require('fs'),
	throttle = require('throttle'),
	lame = require('lame'),
	request = require('request');

var app = express();

var clients = [];

var encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
encoder.on("data", function (data) {
	broadcast(data);
});
var decoder = lame.Decoder();
decoder.on('format', function (format) {
	console.log('decode data', format);
	decoder.pipe(encoder);
});

app.get('/', function (req, res) {
	console.log('Client connected');

	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});

	clients.push(res);

	req.on('end', function () {
		console.log('request ended');
		clients.splice(clients.indexOf(res), 1);
	});

	res.on('end', function () {
		console.log('response ended');
		clients.splice(clients.indexOf(res), 1);
	});
});

function startStreaming(path) {
	console.log('Start streaming');
	var t = new throttle(320 * 1024 / 4);
//	var stream = getRemoteFileStream('https://psv4.vk.me/c4624/u40694345/audios/df13a172a1e3.mp3?extra=BTRPe0AzFi5wgYZ1zndayIopBUuJ28mrNfI7Em-yL0rAq4smoQ9imyJ2klz9-tc-YArxa_MD2gf2OA87g5xO_AtuMav-Y9Y');
	var stream = getLocalFileStream(path);
	var unthrottle = stream.pipe(t);
	unthrottle.on('data', function (data) {
		broadcast(data);
	});

	unthrottle.on('end', function () {
		console.log('Stream ended');
		clients = [];
	});
}

function getRemoteFileStream(url) {
	return request(url);
}

function getLocalFileStream(path) {
	return fs.createReadStream(path)
}

function broadcast(data) {
	clients.forEach(function (client) {
		client.write(data);
	});
}

function closeConnections() {
	clients.forEach(function (client) {
		client.end();
	});
}

var server = app.listen(1337, function () {
	console.log('Listening on port %d', server.address().port);
});

(function (path) {
	startStreaming(path);
})('music.mp3');
