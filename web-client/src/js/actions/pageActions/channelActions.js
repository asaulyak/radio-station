var Constants = require('../../constants/app-constants');
var Dispatcher = require('../../dispatchers/app-dispatcher');

var AppActions = {
	stepMove: function (step) {
		Dispatcher.dispatch({
			actionType: Constants.actionTypes.STEP_MOVE,
			step: step
		});
	},

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
	}
};

module.exports = AppActions;
