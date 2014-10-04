//Exports
var request = require('request'),
	config = require('../config'),
	logger = require('../middleware/logger');

function getContentLength(uri, callback) {
	request.head(uri,
		function (error, res) {
			if (error) {
				callback({
					error: 'Could not get content length.'
				});
				logger.info('HEAD request to', uri, 'returned an error:', error);
				return;
			}

			callback(null, res.headers['content-length'] || 0);
		}
	);
}

var vk = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('mediaSources:vk:baseUrl')
			+ config.get('mediaSources:vk:searchUrl')
				.replace('{access_token}', config.get('mediaSources:vk:access_token'))
				.replace('{query}', query);

		logger.debug('searchUrl', searchUrl);

		request(searchUrl, function (err, data) {
			if (err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body).response;
			data.splice(0, 1);

			callback(null, data
					.map(function (element) {
						if (typeof element === 'object') {
							return {
								title: element.artist + ' - ' + element.title,
								duration: element.duration,
								engine: 'vk',
								id: element.owner_id + '_' + element.aid
							};
						}
					})
			);
		});
	},

	getTrack: function (trackId, callback) {
		var getTrackUrl = config.get('mediaSources:vk:baseUrl')
			+ config.get('mediaSources:vk:trackUrl')
				.replace('{access_token}', config.get('mediaSources:vk:access_token'))
				.replace('{trackId}', trackId);

		request(getTrackUrl, function (err, data) {
			if (err) {
				logger.error('Could not get track information', err);
				callback(err);
				return;
			}
			data = JSON.parse(data.request.response.body).response;
			if (Array.isArray(data)) {
				data = data[0];
			}
			if (!data || !data.url) {
				logger.error('Could not get track. Response does not contain track information');
				callback({
					error: 'Could not get track information'
				});
				return;
			}

			logger.debug('data', data);

			getContentLength(data.url, function (error, contentLength) {
				if (error) {
					logger.error(error);
				}

				callback(null, {
					url: data.url,
					title: data.artist + ' ' + data.title,
					duration: data.duration,
					bitRate: Math.ceil((contentLength / data.duration)) || config.get('streaming:bitRate'),
					id: trackId
				});
			});
		});
	}
};


var sc = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('mediaSources:sc:baseUrl')
			+ config.get('mediaSources:sc:searchUrl')
				.replace('{client_id}', config.get('mediaSources:sc:client_id'))
				.replace('{query}', query);

		logger.debug('searchUrl', searchUrl);

		request(searchUrl, function (err, data) {
			if (err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body);

			if (!data) {
				callback({
					error: 'Could not get track information'
				});
				return;
			}

			callback(null, data
				.filter(function (element) {
					return element.streamable;
				})
				.map(function (element) {
					return {
						title: element.title,
						duration: element.duration,
						engine: 'sc',
						id: element.id
					};
				}));
		});
	},

	getTrack: function (trackId, callback) {
		var trackUrl = config.get('mediaSources:sc:baseUrl')
			+ config.get('mediaSources:sc:trackUrl')
				.replace('{client_id}', config.get('mediaSources:sc:client_id'))
				.replace('{track_id}', trackId);

		request(trackUrl, function (err, data) {
			if (err) {
				callback(err);
				logger.error('Could not get track information', err);
				return;
			}

			data = JSON.parse(data.request.response.body);

			if (!data
				|| !data.stream_url) {

				callback({
					error: 'Could not get track information'
				});
				return;
			}
			data.stream_url = data.stream_url + '?client_id=' + config.get('mediaSources:sc:client_id')

			getContentLength(data.stream_url, function (error, contentLength) {
				if (error) {
					logger.error(error);
				}

				callback(null, {
					url: data.stream_url,
					title: data.title,
					duration: data.duration,
					contentLength: contentLength,
					bitRate: Math.ceil((contentLength / (data.duration
						/ 1000) /*convert milliseconds to seconds*/)) || config.get('streaming:bitRate'),
					id: trackId
				});
			});
		});
	}
};

function MediaSources(engines) {
	if (!(this instanceof MediaSources)) {
		return new MediaSources(engines);
	}

	this._engines = engines;

	this.getEngine = function (name) {
		return this._engines[name];
	};

	this.getEngines = function () {
		var enginesArray = [];
		for (var key in engines) {
			if (engines.hasOwnProperty(key)) {
				enginesArray.push(this._engines[key]);
			}
		}
		return enginesArray;
	};
}

module.exports = new MediaSources({sc: sc, vk: vk});