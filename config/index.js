var nconf = require('nconf'),
	path = require('path');

nconf.argv()
	.env()
	.file({
		file: path.join(__dirname, 'config.json')
	});

var environment = nconf.get('NODE_ENV').trim() + '' || 'development';

var config = nconf.get(environment);
console.log('nconf.get(environment)', nconf.get('NODE_ENV').toString(), config);
module.exports = config;
