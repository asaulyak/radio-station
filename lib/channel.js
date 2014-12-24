//Exports
var Streamer = require('./streamer'),
	logger = require('./../middleware/logger');


var Channel = function () {
	if (!(this instanceof Channel)) {
		return new Channel();
	}

	// region Private properties

	this._streamer = new Streamer();
	this._tracks = [];
	this._isStarted = false;
	this._clients = [];

	// endregion

	// region Public methods

	this.join = function (client) {
		if(!this._isStarted) {
			client.end();
			return;
		}

		this._clients.push(client);
		logger.info('New client connected', this._clients.length);

		client.socket.on('close', function () {
			logger.info('Client disconnected', this._clients.length);
			var position = this._clients.indexOf(client);
			if(position !== -1) {
				logger.debug('Remove client from clients list');
				this._clients.splice(position, 1);
			}
		}.bind(this));
	};

	this.start = function () {
		logger.debug('Start channel');
		this._isStarted = true;
		this._pushNextTrackToStream();
	};

	this.stop = function () {
		this._isStarted = false;
		this._streamer.stop();
	};

	this.addTrack = function (track) {
		logger.debug('Add new track', track);
		this._tracks.push(track);
	};

	// endregion

	// region Private methods

	this._pushNextTrackToStream = function () {
		var track = this._tracks.shift();
		logger.debug('Tracks in queue:', this._tracks.length);

		if (track) {
			logger.debug('Push track to stream', track);
			this._streamer.play(track);
		}
		else {
			this._isStarted = false;
			this._streamer.stop();
		}
	};

	this._bindEvents = function () {
		this._streamer.on('data', this._onStreamDataReceived.bind(this));
		this._streamer.on('end', this._pushNextTrackToStream.bind(this));
	};

	// endregion

	// region Event handlers

	this._onStreamDataReceived = function (data) {
		this._clients.forEach(function (client) {
			client.write(data);
		});
	};

	// endregion

	this._bindEvents();
};

module.exports = Channel;