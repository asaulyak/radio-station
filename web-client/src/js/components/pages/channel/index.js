var React = require('react');
var Steps = require('./steps');
var Dispatcher = require('../../../dispatchers/app-dispatcher');
var Constants = require('../../../constants/app-constants');
var Actions = require('../../../actions/pageActions/channelActions');
var Store = require('../../../stores/pagesStore');
var Events = require('../../../constants/events');
var $ = require('jquery');

var Channel = React.createClass({
	componentWillMount: function () {
		Store.on(Events.pages.channel.CHANNEL_ADD_TRACKS, this.onChannelAddTracks);
		Store.on(Events.server.channel.TRACK_SEARCH_RESPONSE, this.onTrackSearchResponse);
		Store.on(Events.pages.channel.TRACK_ADDED_TO_CHANNEL, this.onTrackAddedToChannel);
	},

	componentDidMount: function () {
		$('#addTracks').hide();
	},

	getInitialState: function () {
		return {
			tracks: [],
			currentStep: 0,
			channelId: null,
			isLoading: false
		};
	},

	getTracks: function () {
		var self = this;

		return this.state.tracks.map(function (track, index) {
			var buttonState = track.isAdded ? 'check' : 'add';
			var buttonIconClassName = buttonState + ' circle icon';
			return (
				<div className="item" key={index}>
					<div className="right floated content">
						<button className="ui button" onClick={self.onAddButtonClick.bind(self, track)}>
							<i className={buttonIconClassName}></i>
							Add
						</button>
					</div>
					<i className="large video play middle aligned icon"></i>

					<div className="content">
						<a className="header">{track.title}</a>
					</div>
				</div>
			);
		});
	},

	getSteps: function () {
		return [
			{
				id: 'chooseName',
				displayName: 'Choose Name',
				description: 'Choose your channel\'s name',
				icon: 'write'
			},
			{
				id: 'addTracks',
				displayName: 'Add tracks',
				description: 'Fill your channel with tracks',
				icon: 'music'
			},
			{
				id: 'startChannel',
				displayName: 'Start channel',
				description: 'Start broadcasting',
				icon: 'announcement'
			}
		];
	},

	onCreateChannelButtonClick: function () {
		Actions.createChannel(this.refs.channelName.getDOMNode().value);
	},

	onTrackSearchResponse: function (data) {
		this.setState({
			tracks: data.tracks,
			isLoading: false
		});
	},

	onTrackAddedToChannel: function (data) {
		if (!data.error) {
			this.setState({
				//currentStep: 2,
				//channelId: data.channelId
			});

			//$('#createChannel').hide();
			//$('#addTracks').show();
		}
	},

	onChannelAddTracks: function (data) {
		if (!data.error) {
			this.setState({
				currentStep: 1,
				channelId: data.channelId
			});

			$('#createChannel').hide();
			$('#addTracks').show();
		}
	},

	onSearchChanged: function (event) {

		// Hit enter
		if (event.charCode === 13) {
			Actions.searchTracks(event.target.value);

			this.setState({
				isLoading: true
			});

			event.preventDefault();
		}
	},

	onAddButtonClick: function (track) {
		track.isAdded = true;
		Actions.addTrackToChannel({
			track: track,
			channelId: this.state.channelId
		});
	},


	render: function () {
		var searchBoxClassList = 'ui left icon input';
		if (this.state.isLoading) {
			searchBoxClassList += ' loading';
		}

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
						<div className={searchBoxClassList}>
							<input onKeyPress={this.onSearchChanged} className="prompt" type="text"
							       placeholder="Search Tracks" autoComplete="off"/>
							<i className="pied piper alternate icon"></i>
						</div>
					</div>
					<div className="ui container">
						<div className="attached segment">
							<h4 className="ui horizontal divider header">
								<i className="music icon small"></i>
							</h4>

							<div className="ui middle aligned divided list relaxed">
								{this.getTracks()}
							</div>
						</div>
					</div>
				</div>
				<Steps steps={this.getSteps()} currentStep={this.state.currentStep}/>
			</div>
		);
	}
});

module.exports = Channel;