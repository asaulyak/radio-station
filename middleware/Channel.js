//Exports
var Streamer = require('./streamer');


var Channel = function () {
	if (!(this instanceof Channel)) {
		return new Channel();
	}

	this.streamer = new Streamer();
	this._tracks = [];

	this.join = function (client) {
		console.log('join client');
		this.streamer.registerClient(client);
	};

	this.start = function () {
		console.log('start channel', this._tracks);
		this.pushTrackToStream();
		this.streamer.on('end', this.pushTrackToStream.bind(this));
	};

	this.pushTrackToStream = function () {
		var track = this._tracks.shift();

		if (track) {
			console.log('Push track to stream', track);
			this.streamer.play(track.url);
		}
	};

	this.stop = function () {
		this.streamer.stop();
	};

	this.addTrack = function (track) {
		this._tracks.push(track);
	}
};

module.exports = Channel;