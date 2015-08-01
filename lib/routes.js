var app = require('./app'),
	restify = require('restify'),
	logger = require('../middleware/logger');

function Routes() {
	if (!(this instanceof Routes)) {
		return new Routes();
	}

	this.webSocket = {};

	this.root = function (req, res) {
		var baseUrl = [req.isSecure() ? 'https' : 'http',
			'://',
			req.headers.host]
			.join('');

		var startLink = [
			'<',
			baseUrl,
			'/api/channel/create/',
			'channel_name',
			'>;',
			'rel="start"'
		].join('');

		var searchLink = [
			'<',
			baseUrl,
			'/api/search/',
			'query',
			'>;',
			'rel="search"'
		].join('');

		res.header('Link', startLink + ',' + searchLink);
		res.status(204);
		res.end();
	};

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

		var baseUrl = [req.isSecure() ? 'https' : 'http',
			'://',
			req.headers.host]
			.join('');

		var addTrackLink = [
			'<',
			baseUrl,
			'/api/channel/addtrack/',
			uid,
			'>;',
			'rel="addTrack"'
		].join('');

		var nextLink = [
			'<',
			baseUrl,
			'/api/channel/start/',
			uid,
			'>;',
			'rel="next"'
		].join('');

		var deleteLink = [
			'<',
			baseUrl,
			'/api/channel/remove/',
			uid,
			'>;',
			'rel="deleteChannel"'
		].join('');

		res.header('Link', nextLink + ',' + addTrackLink + ',' + deleteLink);
		res.status(200);
		res.json({
			uid: uid
		});
		res.end();
	};

	this.deleteChannel = function (req, res) {
		var uid = req.params.uid;

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
	};

	this.startChannel = function (req, res) {
		var uid = req.params.uid;

		app.startChannel(uid, function (error, data) {
			if (error) {
				res.status(400);
				res.json(error);
			}
			else {
				var nextLink = [
					'<',
					req.isSecure() ? 'https' : 'http',
					'://',
					req.headers.host,
					'/api/channel/listen/',
					uid,
					'>;',
					'rel="next"'
				].join('');

				logger.log('nextLink', nextLink);
				res.header('Link', nextLink);
				res.status(200);
				res.json(data);
			}

			res.end();
		}.bind(this));
	};

	this.addTrackToChannel = function (req, res) {
		var uid = req.params.uid;

		app.addTrackToChannel({
			uid: uid,
			engineId: req.body.engine,
			trackId: req.body.id
		}, function (error, data) {
			if (error) {
				res.json(error);
			}
			else {
				var nextLink = [
					'<',
					req.isSecure() ? 'https' : 'http',
					'://',
					req.headers.host,
					'/api/channel/start/',
					uid,
					'>;',
					'rel="next"'
				].join('');
				res.header('Link', nextLink);
				res.status(200);
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

		next();
	};

	this.webSocket.onConnect = function (socket) {
		logger.debug('client connected via web socket');

		socket.on('listen', function (channelId) {
			logger.debug('listen', channelId);

			socket.join(channelId);
			socket.emit('metadata', app.getChannelMetadata(channelId));
		});

		socket.on('currentTrack', function (channelId) {
			socket.emit('metadata', app.getChannelMetadata(channelId));
		});
	};

	this.onUnknownMethodRequest = function (req, res) {
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

	this.onRequestExecuted = function (req, res) {
		if (res.methods &&
			res.methods.indexOf('OPTIONS') === -1) {
			res.methods.push('OPTIONS');
		}
	};
}

module.exports = new Routes();
