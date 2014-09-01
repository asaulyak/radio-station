//Exports
var fs = require('fs'),
	request = require('request'),
	throttle = require('throttle'),
	EventEmitter = require('events').EventEmitter,
	config = require('../config');


var Channel = function () {
	if(!(this instanceof Channel)) {
		return new Channel();
	}
};

module.exports = Channel;