var AppDispatcher = require('../dispatchers/app-dispatcher');
var Events = require('../constants/events');
var assign = require('react/lib/Object.assign');
var Constants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');

var store = assign(EventEmitter.prototype, {
	dispatcherIndex: AppDispatcher.register(function (action) {
		switch (action.actionType) {
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

			case Constants.actionTypes.TRACK_SEARCH:
				$.ajax({
					url: '/api/search/' + action.query,
					method: 'GET'
				})
					.done(function (data) {
						store.emit(Events.server.channel.TRACK_SEARCH_RESPONSE,
							{
								tracks: data
							});
					})
					.fail(function (data) {
						debugger;
					});
				break;
			case Constants.actionTypes.ADD_TRACK_TO_CHANNEL:
				$.ajax({
					url: '/api/channel/addtrack/' + action.channelId,
					method: 'POST',
					contentType: 'application/json',
					dataType: 'json',
					data: JSON.stringify({
						id: action.track.id,
						engine: action.track.engine
					})
				})
					.done(function (data) {
						debugger;
						store.emit(Events.pages.channel.TRACK_ADDED_TO_CHANNEL,
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