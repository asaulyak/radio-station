var app = require('./app'),
	config = require('../config'),
	Channel = require('./channel'),
	mediaSources = require('./mediaSources'),
	restify = require('restify'),
	logger = require('../middleware/logger');

function Routes() {
	if (!(this instanceof Routes)) {
		return new Routes();
	}

	this.listenChannel = function (req, res) {
		var uid = req.params.uid;
		logger.debug('Play channel', uid);

		var channel = app.getChannel(uid);
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
	};

	this.createChannel = function (req, res) {
		var uid = app.createChannel(req.params.name);

		res.json({uid: uid});
		res.end();
	};

	this.deleteChannel = function (req, res) {
		var uid = req.params.uid,
			channel = channels[uid];

		app.deleteChannel(uid, function (error, data) {
			if (error) {
				res.status(400);
				res.json(error);
			}
			else {
				res.json(data);
			}

			res.end();
		});
		if (channel) {
			channel.stop();
			channel = null;
			res.json({uid: uid});
		}
		else {
			res.status(400);
			res.json({
				error: 'Channel does not exist.'
			});
		}

		res.end();
	};

	this.startChannel = function (req, res) {
		var uid = req.params.uid;

		app.startChannel(uid, function (error, data) {
			if (error) {
				res.status(400);
				res.json(error);
			}
			else {
				res.json(data);
			}

			res.end();
		});
	};

	this.addTrackToChannel = function (req, res) {
		app.addTrackToChannel({
			uid: req.params.uid,
			engineId: req.body.engine,
			trackId: req.body.id
		}, function (error, data) {
			if (error) {
				res.json(error);
			}
			else {
				res.json(data);
			}

			res.end();
		});
	};

	this.searchTracks = function (req, res, next) {
		app.searchTracks(req.params.query, function (err, results) {
			if (err) {
				res.json(err);
			} else {
				res.json(results);
			}

			res.end();
		});

		return next();
	};

	this.unknownMethodHandler = function (req, res) {
		if (req.method.toLowerCase() === 'options') {
			var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version'];

			if (res.methods.indexOf('OPTIONS') === -1) {
				res.methods.push('OPTIONS');
			}

			res.header('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
			res.header('Access-Control-Allow-Methods', res.methods.join(', '));
			res.header('Access-Control-Allow-Origin', req.headers.origin);

			return res.send(204);
		}
		else {
			return res.send(new restify.MethodNotAllowedError());
		}
	};
}

module.exports = new Routes();