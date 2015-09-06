var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
	navigate: function (path) {
		AppDispatcher.dispatch({
			actionType: AppConstants.actionTypes.ROUTE_NAVIGATE,
			path: path
		});
	}
};

module.exports = AppActions;
