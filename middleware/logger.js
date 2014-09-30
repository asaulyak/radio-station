var logger = require('winston'),
	config = require('../config');

logger.setLevels({
	debug: 0,
	info: 1,
	silly: 2,
	warn: 3,
	error: 4
});
logger.addColors({
	debug: 'green',
	info: 'cyan',
	silly: 'magenta',
	warn: 'yellow',
	error: 'red'
});
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	level: config.get('logging:level'),
	timestamp: function () {
		return '['
			+ new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')
			+ ']';
	},
	colorize: config.get('logging:colorize')
});

module.exports = logger;