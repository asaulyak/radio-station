var config = require('./config'),
	logger = require('./middleware/logger'),
	restify = require('restify'),
	routes = require('./lib/routes');

var server = restify.createServer();

global.io = require('socket.io').listen(server.server);

// Restify bundles
server.use(restify.bodyParser());
server.use(restify.fullResponse());

// Subscribe to server events
server.on('MethodNotAllowed', routes.onUnknownMethodRequest);
server.on('after', routes.onRequestExecuted);

// Routes REST API
server.get('/api', routes.root);
server.get('/api/channel/listen/:uid', routes.listenChannel);
server.post('/api/channel/create/:name', routes.createChannel);
server.del('/api/channel/remove/:uid', routes.deleteChannel);
server.post('/api/channel/start/:uid', routes.startChannel);
server.post('/api/channel/addtrack/:uid', routes.addTrackToChannel);
server.get('/api/search/:query', routes.searchTracks);
server.head('/api/search/:query', routes.searchTracks);

// Web client routes
server.get(/public\/.*/, restify.serveStatic({
	'directory': __dirname + '/web-client/'
}));

server.get(/.*/, restify.serveStatic({
	'directory': __dirname + '/web-client/public/',
	'file': 'index.html'
}));

// Web sockets
global.io.sockets.on('connection', routes.webSocket.onConnect);

// Start server
server.listen(
	config.port,
	config.ip,
	function () {
		logger.info('Listening on port %d', server.address().port);
	}
);

