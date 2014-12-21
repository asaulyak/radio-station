var config = require('./config'),
	Channel = require('./lib/channel'),
	mediaSources = require('./lib/mediaSources'),
	logger = require('./middleware/logger'),
	restify = require('restify'),
	routes = require('./lib/routes');

var server = restify.createServer();

// Restify bundles
server.use(restify.bodyParser());
server.use(restify.fullResponse());

function unknownMethodHandler(req, res, cb) {
	if (req.method.toLowerCase() === 'options') {
		var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version'];

		if (res.methods.indexOf('OPTIONS') === -1) {
			res.methods.push('OPTIONS');
		}

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
		res.header('Access-Control-Allow-Methods', res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);

		return res.send(204);
	}
	else {
		return res.send(new restify.MethodNotAllowedError());
	}
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.get('/api/channel/listen/:uid', routes.listenChannel);

server.post('/api/channel/create/:name', routes.createChannel);

server.del('/api/channel/remove/:uid', routes.deleteChannel);

server.post('/api/channel/start/:uid', routes.startChannel);

server.post('/api/channel/addtrack/:uid', routes.addTrackToChannel);

server.get('/api/search/:query', routes.searchTracks);

server.head('/api/search/:query', routes.searchTracks);

server.listen(process.env.OPENSHIFT_NODEJS_PORT || config.get('port'),
	process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	function () {
		logger.info('Listening on port %d', server.address().port);
	}
);

