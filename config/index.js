var nconf = require('nconf'),
	path = require('path');

nconf.argv()
	.env()
	.file({
		file: path.join(__dirname, 'config.json')
	});

var nodeEnv = nconf.get('NODE_ENV'),
	environment = nodeEnv ? nodeEnv.trim() : 'development';

environment = nconf.get(environment) ? environment : 'development';

var port = nconf.get(environment + ':port') || 1337,
	ip = nconf.get(environment + ':ip') || '127.0.0.1';


switch (environment) {
	case 'openshift':
		port = nconf.get('OPENSHIFT_NODEJS_PORT') || port;
		ip = nconf.get('OPENSHIFT_NODEJS_IP') || ip;
		break;
	default:
		port = nconf.get('PORT') || port;
}

nconf.set(environment + ':port', port);
nconf.set(environment + ':ip', ip);

module.exports = nconf.get(environment);
