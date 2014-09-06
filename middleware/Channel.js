//Exports
var Streamer = require('./streamer');


var Channel = function () {
	if(!(this instanceof Channel)) {
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
		this.streamer.play(this._tracks.pop().url);
	};

	this.stop = function () {
		this.streamer.stop();
	};

	this.addTrack = function (track) {
		this._tracks.push(track);
	}
};

module.exports = Channel;