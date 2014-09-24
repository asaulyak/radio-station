//Exports
var Streamer = require('./streamer');


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
		console.log('New client connected');
		this.streamer.registerClient(client);
	};

	this.start = function () {
		console.log('Start channel', this._tracks);
		this._isStarted = true;
		this.pushNextTrackToStream();
		this.streamer.on('end', this.pushNextTrackToStream.bind(this));
	};

	this.pushNextTrackToStream = function () {
		var track = null;
		console.log('Tracks in queue:', this._tracks.length);
		while(!track
			&& this._tracks.length) {
			track = this._tracks.shift();
		}		

		if (track) {
			console.log('Push track to stream', track);
			this.streamer.play(track.url);
		}
		// Uncomment when runtime audio bit rate detecting is supported
		// else {
			// this._isStarted = false;
			// this.streamer.stop();
		// }
	};

	this.stop = function () {
		this._isStarted = false;
		this.streamer.stop();
	};

	this.addTrack = function (track) {
		console.log('Add new track', track);
		this._tracks.push(track);
	}
};

module.exports = Channel;