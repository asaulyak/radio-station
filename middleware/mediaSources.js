//Exports
var request = require('request'),
	config = require('../config/index');

var vk = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('vk:baseUrl')
			+ config.get('vk:searchUrl')
			.replace('{access_token}', config.get('vk:access_token'))
			.replace('{query}', query);

		console.log('searchUrl', searchUrl);

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
		var getTrackUrl = config.get('vk:baseUrl')
			+ config.get('vk:trackUrl')
				.replace('{access_token}', config.get('vk:access_token'))
				.replace('{trackId}', trackId);

		request(getTrackUrl, function (err, data) {
			if (err) {
				callback(err);
				return;
			}
			data = JSON.parse(data.request.response.body).response;
			if(Array.isArray(data)) {
				data = data[0];
			}
			if(!data
				|| !data.url) {
				callback({
					error: 'Could not get track information'
				});
				return;
			}

			callback(null, {
				url: data.url,
				title: data.artist + ' ' + data.title,
				duration: data.duration,
				id: trackId
			});
		});
	}
};


var sc = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('sc:baseUrl')
			+ config.get('sc:searchUrl')
				.replace('{client_id}', config.get('sc:client_id'))
				.replace('{query}', query);

		console.log('searchUrl', searchUrl);

		request(searchUrl, function (err, data) {
			if (err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body);

			if(!data
				|| !data.url) {
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
						engine:'sc',
						id: element.id
					};
				}));
		});
	},

	getTrack: function (trackId, callback) {
		var trackUrl = config.get('sc:baseUrl')
			+ config.get('sc:trackUrl')
				.replace('{client_id}', config.get('sc:client_id'))
				.replace('{track_id}', trackId);

		request(trackUrl, function (err, data) {
			if (err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body);

			callback(null, {
				url: data.stream_url + '?client_id=' + config.get('sc:client_id'),
				title: data.title,
				duration: data.duration,
				id: trackId
			});
		});
	}
};

function MediaSources (engines) {
	if(!(this instanceof MediaSources)) {
		return new MediaSources(engines);
	}

	this._engines = engines;

	this.getEngine = function (name) {
		return this._engines[name];
	};

	this.getEngines = function () {
		var enginesArray = [];
		for(var key in engines) {
			if(engines.hasOwnProperty(key)) {
				enginesArray.push(this._engines[key]);
			}
		}
		return enginesArray;
	};
}

module.exports = new MediaSources({sc: sc, vk: vk});