var AppConstants = require('../../constants/app-constants');
var AppDispatcher = require('../../dispatchers/app-dispatcher');

var AppActions = {
	stepMove: function (step) {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.events.pages.channel.STEP_MOVE,
			step: step
		});
	}
};

module.exports = AppActions;
