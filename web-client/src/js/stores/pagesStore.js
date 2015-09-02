var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var store = assign(EventEmitter.prototype, {
	dispatcherIndex: AppDispatcher.register(function (payload) {
		var action = payload.action;

		switch (action.actionType) {
			case AppConstants.events.pages.channel.STEP_MOVE:
				store.emit(AppConstants.events.pages.channel.STEP_MOVE, {
					step: action.step
				});
				break;
		}

		return true;
	})
});

module.exports = store;