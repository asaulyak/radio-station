//Exports
var Streamer = require('./streamer');


var Channel = function () {
	if(!(this instanceof Channel)) {
		return new Channel();
	}

	this.streamer = new Streamer();

	this.join = function (client) {
		console.log('join client');
		this.streamer.registerClient(client);
	};

	this.start = function (songId) {
		console.log('start channel');
//		this.streamer.play('');
	};

	this.stop = function () {
		this.streamer.stop();
	};
};

module.exports = Channel;