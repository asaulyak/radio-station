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

app.get('/add', function (req, res) {
	console.log('Add audio to stream');
//	streamer.play('https://psv4.vk.me/c521404/u59066720/audios/42735ac8b36e.mp3?extra=WfOioggRDOsCYk6vU-8JEQAMbV4K4FL4vCLFAek4y5jF5n1t2BtXxsZk1vsqU5iLaPZmLYSIftvKahYL6NKCQc0OYjx2WwhKtQ,232');
	res.end();
});

app.get('/', function (req, res) {
	console.log('Client connected');

	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});


//	streamer.registerClient(res);

//	streamer.on('end', function () {
//		console.log('on end');
//	});
});

var server = app.listen(config.get('port'), function () {
	console.log('Listening on port %d', server.address().port);
});
