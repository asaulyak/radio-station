var React = require('react');
var Steps = require('./steps');
var Dispatcher = require('../../../dispatchers/app-dispatcher');
var Constants = require('../../../constants/app-constants');
var Actions = require('../../../actions/pageActions/channelActions');
var Store = require('../../../stores/pagesStore');
var Events = require('../../../constants/events');

var Channel = React.createClass({
	componentWillMount: function () {
		Store.on(Events.pages.channel.CHANNEL_ADD_TRACKS, function (data) {
			if(!data.error) {
				Actions.stepMove(1);
			}
		});
	},

	onCreateChannelButtonClick: function () {
		Actions.createChannel(this.refs.channelName.getDOMNode().value);
	},

	render: function () {
		return (
			<div className="ui raised very padded container segment">
				<h1 className="ui header">Create new channel</h1>

				<form className="ui form">
					<div className="field">
						<label>Channel Name</label>
						<input type="text" ref="channelName" name="first-name" placeholder="Channel Name"/>
					</div>

					<div className="field">
						<div className="ui checkbox">
							<input type="checkbox" tabIndex="0"/>
							<label>I agree to the Terms and Conditions</label>
						</div>
					</div>
					<button onClick={this.onCreateChannelButtonClick} className="ui button" type="button">Create</button>
				</form>
				<Steps/>
			</div>
		);
	}
});

module.exports = Channel;