var express = require('express'),
	config = require('./config'),
	streamer = require('./middleware/streamer');

var app = express();

app.get('/', function (req, res) {
	console.log('Client connected');

	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});

	streamer.registerClient(res);

	streamer.on('end', function () {
		console.log('on end');
	});
});

app.get('/add', function (req, res) {
	console.log('Add audio to stream');
	streamer.play('https://psv4.vk.me/c521404/u59066720/audios/42735ac8b36e.mp3?extra=WfOioggRDOsCYk6vU-8JEQAMbV4K4FL4vCLFAek4y5jF5n1t2BtXxsZk1vsqU5iLaPZmLYSIftvKahYL6NKCQc0OYjx2WwhKtQ,232');
	res.end();
});

var server = app.listen(config.get('port'), function () {
	console.log('Listening on port %d', server.address().port);
});
