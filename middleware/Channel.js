//Exports
var Streamer = require('./streamer');


var Channel = function () {
	if(!(this instanceof Channel)) {
		return new Channel();
	}

	this.streamer = new Streamer();

	console.log('streamer clients', this.streamer.getClients().length);

	this.join = function (client) {
		console.log('join client');
		this.streamer.registerClient(client);
	};

	this.start = function () {
		console.log('start channel');
		this.streamer.play('https://psv4.vk.me/c5861/u171788897/audios/0241b9fcaf11.mp3?extra=wCtc3yOyXRpVKg6AFyesR119FLSygFvg7BmKpXx0ypO37MUEkClbXhuIPIsw9X8GC0kZX-Mig6tzOpKqBdGi7xlITiVnqLE,276');
	};

	this.stop = function () {
		this.streamer.stop();
	};
};

module.exports = Channel;