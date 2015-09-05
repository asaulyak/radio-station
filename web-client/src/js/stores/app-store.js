var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var Events = require('../constants/events');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var AppStore = assign(EventEmitter.prototype, {
	dispatcherIndex: AppDispatcher.register(function (payload) {
		var action = payload.action;

		switch (action.actionType) {
			case AppConstants.actionTypes.ROUTE_NAVIGATE:
				AppStore.emit(Events.routes.ROUTE_CHANGED, action.path);
				break;
		}

		return true;
	})
});

module.exports = AppStore;