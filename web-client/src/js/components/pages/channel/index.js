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
		Store.on(Events.server.channel.TRACK_SEARCH_RESPONSE, this.onTrackSearchResponse.bind(this));
	},

	componentDidMount: function () {
		$('#addTracks').hide();
	},

	getInitialState: function () {
		return {
			tracks: [
				//'Three
			]
		};
	},

	getTracks: function () {
		return this.state.tracks.map(function (track, index) {
			return (
				<div className="item" key={index}>
					<div className="right floated content">
						<div className="ui button">Add</div>
					</div>
					<i className="large video play middle aligned icon"></i>

					<div className="content">
						<a className="header">{track.title}</a>
					</div>
				</div>
			);
		});
	},

	onCreateChannelButtonClick: function () {
		Actions.createChannel(this.refs.channelName.getDOMNode().value);
	},

	onTrackSearchResponse: function (data) {
		this.setState({
			tracks: data.tracks
		});
	},

	onChannelAddTracks: function (data) {

		if (!data.error) {
			Actions.stepMove(1);
			$('#createChannel').hide();
			$('#addTracks').show();
		}
	},

	onSearchChanged: function (event) {
		if (event.charCode === 13) {
			Actions.searchTracks(event.target.value);

			event.preventDefault();
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
							<input onKeyPress={this.onSearchChanged.bind(this)} className="prompt" type="text" placeholder="Search Tracks" autocomplete="off"/>
							<i className="pied piper alternate icon"></i>
						</div>

					</div>
					<div className="ui container">
						<div className="attached segment">
							<h4 className="ui horizontal divider header">
								<i className="music icon small"></i>
								Search Results
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