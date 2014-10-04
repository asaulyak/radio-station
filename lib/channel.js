//Exports
var Streamer = require('./streamer'),
	logger = require('./../middleware/logger');


var Channel = function () {
	if (!(this instanceof Channel)) {
		return new Channel();
	}

	this.streamer = new Streamer();
	this._tracks = [];
	this._isStarted = false;

	this.join = function (client) {
		if(!this._isStarted) {
			client.end();
			return;
		}
		logger.debug('New client connected');
		this.streamer.registerClient(client);
	};

	this.start = function () {
		logger.debug('Start channel');
		this._isStarted = true;
		this.pushNextTrackToStream();
		this.streamer.on('end', this.pushNextTrackToStream.bind(this));
	};

	this.pushNextTrackToStream = function () {
		var track = this._tracks.shift();
		logger.debug('Tracks in queue:', this._tracks.length);

		if (track) {
			logger.debug('Push track to stream', track);
			this.streamer.play(track);
		}
		else {
			this._isStarted = false;
			this.streamer.stop();
		}
	};

	this.stop = function () {
		this._isStarted = false;
		this.streamer.stop();
	};

	this.addTrack = function (track) {
		logger.debug('Add new track', track);
		this._tracks.push(track);
	}
};

module.exports = Channel;