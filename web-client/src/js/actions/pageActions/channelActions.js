var Constants = require('../../constants/app-constants');
var Dispatcher = require('../../dispatchers/app-dispatcher');

var AppActions = {
	createChannel: function (channelName) {
		Dispatcher.dispatch({
			actionType: Constants.actionTypes.CREATE_CHANNEL,
			channelName: channelName
		});
	},

	searchTracks: function (query) {
		Dispatcher.dispatch({
			actionType: Constants.actionTypes.TRACK_SEARCH,
			query: query
		});
	},

	addTrackToChannel: function (data) {
		Dispatcher.dispatch({
			actionType: Constants.actionTypes.ADD_TRACK_TO_CHANNEL,
			track: data.track,
			channelId: data.channelId
		});
	},

	startChannel: function (data) {
		Dispatcher.dispatch({
			actionType: Constants.actionTypes.START_CHANNEL,
			channelId: data.channelId
		});
	}
};

module.exports = AppActions;
