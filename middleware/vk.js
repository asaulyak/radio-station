//Exports
var request = require('request'),
	config = require('../config');

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
						album: element.album,
						url: element.url,
						duration: element.duration
					};
				}				
			}));
		});
	}
};

module.exports = vk;