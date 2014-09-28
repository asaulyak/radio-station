var express = require('express'),
	config = require('./config'),
	Channel = require('./lib/channel'),
	async = require('async'),
	mediaSources = require('./lib/mediaSources'),
	bodyParser = require('body-parser'),
	guid = require('./middleware/guid')
	logger = require('./middleware/logger');

var app = express(),
	channels = {};

app.use(bodyParser.json());

app.get('/api/channel/listen/:uid', function (req, res) {
	var uid = req.params.uid;
	logger.debug('play channel', uid);
	
	var channel = channels[uid];
	if (channel) {
		res.writeHead(200, {
			'Content-Type': 'audio/mpeg'
		});
		channel.join(res);
	}
	else {
		res.status(404);
		res.end();
	}
});

app.put('/api/channel/create/:name', function (req, res) {
	logger.debug('/channel/create/');
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

app.put('/api/channel/addtrack/:uid', function (req, res) {
	logger.debug('uid', req.params.uid, req.body);
	var channel = channels[req.params.uid];
	if (channel) {
		var engine = mediaSources.getEngine(req.body.engine);

		engine.getTrack(req.body.id, function (err, track) {
			if (!err) {
				channel.addTrack(track);
				res.write(track.url);
			}
			else {
				res.write(err);	
			}
					
			res.end();
		});
	}

	
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

var server = app.listen(process.env.OPENSHIFT_NODEJS_PORT || config.get('port'),
						process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
						function () {
							logger.info('Listening on port %d', server.address().port);
						}
);
