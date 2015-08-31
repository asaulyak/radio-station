var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var AppStore = assign(EventEmitter.prototype, {
	dispatcherIndex: AppDispatcher.register(function (payload) {
		var action = payload.action;

		switch (action.actionType) {
			case AppConstants.RESET_ROUTE:
				AppStore.emit(AppConstants.RESET_ROUTE);
				break;
		}

		return true;
	})
});

module.exports = AppStore;