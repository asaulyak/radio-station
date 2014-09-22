var express = require('express'),
	config = require('./config'),
	Channel = require('./middleware/channel'),
	async = require('async'),
	mediaSources = require('./middleware/mediaSources'),
	bodyParser = require('body-parser'),
	guid = require('./middleware/guid');

var app = express(),
	channels = {};

app.use(bodyParser.json());

app.get('/api/channel/listen/:uid', function (req, res) {
	var uid = req.params.uid;
	console.log('play channel', uid);
	res.writeHead(206, {
		'Content-Type': 'audio/mpeg'
	});
	var channel = channels[uid];
	if (channel) {
		channel.join(res);
	}
});

app.put('/api/channel/create/:name', function (req, res) {
	console.log('/channel/create/');
	var uid = guid();
	channels[uid] = new Channel(req.params.name);

	res.json({uid: uid});
	res.end();
});

app.delete('/api/channel/remove/:uid', function (req, res) {
	var uid = req.params.uid,
		channel = channels[uid];
	if (channel) {
		channel.stop();
		channel = null;
		res.json({uid: uid});
	}
	else {
		res.json({
			error: 'Channel does not exist.'
		});
	}

	res.end();
});

app.post('/api/channel/start/:uid', function (req, res) {
	var uid = req.params.uid,
		channel = channels[uid];
	if (channel) {
		channel.start();
		res.json({uid: uid});
	}
	else {
		res.json({
			error: 'Channel does not exist.'
		});
	}

	res.end();
});

app.put('/api/channel/:uid/addtrack/', function (req, res) {
	console.log('uid', req.params.uid, req.body);
	var channel = channels[req.params.uid];
	if (channel) {
		var engine = mediaSources.getEngine(req.body.engine);

		engine.getTrack(req.body.id, function (err, track) {
			if (!err) {
				channel.addTrack(track);
			}
		});
	}

	res.end();
});

app.get('/api/search/:query', function (req, res) {

	// Create array of tasks to be ran for each media source
	var tasks = mediaSources.getEngines().map(function (source) {
		return function (callback) {
			source.searchMusic(encodeURIComponent(req.params.query), callback);
		}
	});

	// Run music search in parallel
	async.parallel(tasks,
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

app.get('/test', function (req, res) {
	setTimeout(3000, function () {
		console.log('closed');
		res.end();
	});
	console.log('connected');
});

var server = app.listen(process.env.OPENSHIFT_NODEJS_PORT || config.get('port'),
						process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
						function () {
							console.log('Listening on port %d', server.address().port);
						}
);
