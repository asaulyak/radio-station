var AppDispatcher = require('../dispatchers/app-dispatcher');
var Events = require('../constants/events');
var assign = require('react/lib/Object.assign');
var Constants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;

var store = assign(EventEmitter.prototype, {
	dispatcherIndex: AppDispatcher.register(function (action) {
		switch (action.actionType) {
			case Constants.actionTypes.STEP_MOVE:
				store.emit(Events.pages.channel.STEP_MOVE, {
					step: action.step
				});
				break;

			case Constants.actionTypes.CREATE_CHANNEL:
				$.ajax({
					url: '/api/channel/create/' + action.channelName,
					method: 'POST'
				})
					.done(function (data) {
						store.emit(Events.pages.channel.CHANNEL_ADD_TRACKS,
							{
								channelId: data.uid
							});
					})
				.fail(function (data) {
						debugger;
					});
				break;
		}

		return true;
	})
});

module.exports = store;