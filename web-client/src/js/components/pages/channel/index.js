var React = require('react');
var Steps = require('./steps');
var Dispatcher = require('../../../dispatchers/app-dispatcher');
var Constants = require('../../../constants/app-constants');
var Actions = require('../../../actions/pageActions/channelActions');
var Store = require('../../../stores/pagesStore');
var Events = require('../../../constants/events');

var Channel = React.createClass({
	componentWillMount: function () {
		Store.on(Events.pages.channel.CHANNEL_ADD_TRACKS, this.onChannelAddTracks.bind(this));
	},

	componentDidMount: function () {
		$('#addTracks').hide();
	},

	getInitialState: function () {
		return {
			tracks: [
				'Three Days Grace - Time Of Dying',
				'Serj Tankian - Empty Walls',
				'Skillet - Rise',
				'IAMX - You Can Be Happy'
			]
		};
	},

	getTracks: function () {
		return this.state.tracks.map(function (track) {
			return (
				<div className="item" key={track}>
					<div className="right floated content">
						<div className="ui button">Add</div>
					</div>
					<i className="large video play middle aligned icon"></i>

					<div className="content">
						<a className="header">{track}</a>
					</div>
				</div>
			);
		});
	},

	onCreateChannelButtonClick: function () {
		Actions.createChannel(this.refs.channelName.getDOMNode().value);
	},

	onChannelAddTracks: function (data) {
		if (!data.error) {
			Actions.stepMove(1);
			$('#createChannel').hide();
			$('#addTracks').show();
		}
	},

	render: function () {
		return (
			<div className="ui raised very padded container segment">
				<div id="createChannel">
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
						<button onClick={this.onCreateChannelButtonClick} className="ui button" type="button">Create
						</button>
					</form>
				</div>
				<div id="addTracks">
					<h1 className="ui header">Add tracks to channel</h1>

					<div className="ui search focus">
						<div className="ui left icon input">
							<input className="prompt" type="text" placeholder="Search Tracks" autocomplete="off"/>
							<i className="pied piper alternate icon"></i>
						</div>

					</div>
					<div className="ui container">
						<div className="attached segment">
							<h4 className="ui horizontal divider header">
								<i className="music icon small"></i>
								{'Search Results'}
							</h4>

							<div className="ui middle aligned divided list relaxed">
								{this.getTracks()}
							</div>
						</div>
					</div>

				</div>
				<Steps/>
			</div>
		);
	}
});

module.exports = Channel;