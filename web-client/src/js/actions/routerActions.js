var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
	resetRoute: function () {
		AppDispatcher.handleViewAction({
			actionType: AppConstants.RESET_ROUTE
		});
	}
};

module.exports = AppActions;
