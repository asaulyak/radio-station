var express = require('express'),
	config = require('./config'),
	Channel = require('./middleware/channel'),
	async = require('async'),
	mediaSources = require('./middleware/mediaSources');

var app = express(),
	channels = {};

app.get('/api/channel/play/:name', function (req, res) {
	console.log('play channel', req.params.name, channels[req.params.name]);
	res.writeHead(200, {
		'Content-Type': 'audio/mpeg'
	});
	var channel = channels[req.params.name];
	if (channel) {
		channel.join(res);
	}
});

app.get('/api/channel/create/:name', function (req, res) {
	console.log('/channel/create/');
	var channel = new Channel();
	channels[req.params.name] = channel;
	channel.start();

	res.write('Channel ' + req.params.name + ' has been added.');
	res.end();
});

app.get('/api/channel/remove/:name', function (req, res) {
	console.log(req.params);
	channels[req.params.name].stop();
	res.end();
});

app.get('/api/search/:query', function (req, res) {

	// Create array of tasks to be ran for each media source
	var sources = mediaSources.map(function (source) {
		return function (callback) {
			source.searchMusic(encodeURIComponent(req.params.query), callback);
		}
	});

	// Run music search in parallel
	async.parallel(sources,
		function (err, results) {
			if (err) {
				res.json(err);
				res.end();
				return;
			}

			// Merge arrays of results and return those as JSON
			res.json([].concat.apply([], results));
			res.end();
		});
});

var server = app.listen(config.get('port'), function () {
	console.log('Listening on port %d', server.address().port);
});
