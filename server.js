var config = require('./config'),
	logger = require('./middleware/logger'),
	restify = require('restify'),
	routes = require('./lib/routes');

var server = restify.createServer();

// Restify bundles
server.use(restify.bodyParser());
server.use(restify.fullResponse());

// Subscribe to server events
server.on('MethodNotAllowed', routes.onUnknownMethodRequest);
server.on('after', routes.onRequestExecuted);

// Routes
server.get('/api/channel/listen/:uid', routes.listenChannel);

server.post('/api/channel/create/:name', routes.createChannel);

server.del('/api/channel/remove/:uid', routes.deleteChannel);

server.post('/api/channel/start/:uid', routes.startChannel);

server.post('/api/channel/addtrack/:uid', routes.addTrackToChannel);

server.get('/api/search/:query', routes.searchTracks);

server.head('/api/search/:query', routes.searchTracks);

// Start server
server.listen(
	config.port,
	config.ip,
	function () {
		logger.info('Listening on port %d', server.address().port);
	}
);

