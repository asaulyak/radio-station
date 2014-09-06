//Exports
var request = require('request'),
	config = require('../config/index');

var vk = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('vk:searchUrl')
			.replace('{access_token}', config.get('vk:access_token'))
			.replace('{query}', query);

		console.log('searchUrl', searchUrl);

		request(searchUrl, function (err, data) {
			if(err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body);
			data.response.splice(0, 1);

			callback(null, data.response.map(function (element) {
				if(typeof element === 'object') {
					return {
						title: element.title,
						url: element.url,
						duration: element.duration
					};
				}
			}));
		});
	}
};


var sc = {
	searchMusic: function (query, callback) {
		var searchUrl = config.get('sc:searchUrl')
			.replace('{client_id}', config.get('sc:client_id'))
			.replace('{query}', query);

		console.log('searchUrl', searchUrl);

		request(searchUrl, function (err, data) {
			if(err) {
				callback(err);
				return;
			}

			data = JSON.parse(data.request.response.body);

			callback(null, data
				.filter(function (element) {
					return element.streamable;
				})
				.map(function (element) {
					return {
						title: element.title,
						url: element.stream_url + '?client_id=' + config.get('sc:client_id'),
						duration: element.duration
					};
				}));
		});
	}
};

module.exports = [vk, sc];