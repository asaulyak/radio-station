var express = require('express'),
	config = require('./config'),
	Channel = require('./middleware/Channel');

var app = express(),
	channels = {};

app.get('/channel/play/:name', function (req, res) {
	console.log('play channel', req.params.name, channels[req.params.name]);
	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});
	var channel = channels[req.params.name];
	if(channel) {
		channel.join(res);
	}
});

app.get('/channel/create/:name', function (req, res) {
	console.log('/channel/create/');
	var channel = new Channel();
	channels[req.params.name] = channel;
	channel.start();

	res.write('Channel ' + req.params.name + ' has been added.');
	res.end();
});

app.get('/channel/remove/:name', function (req, res) {
	console.log(req.params);
	channels[req.params.name].stop();
	res.end();
});

app.get('/', function (req, res) {
	console.log('Client connected');

	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});
});

var server = app.listen(config.get('port'), function () {
	console.log('Listening on port %d', server.address().port);
});
