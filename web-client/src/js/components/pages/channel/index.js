var React = require('react');
var Steps = require('./steps');
var Dispatcher = require('../../../dispatchers/app-dispatcher');
var Constants = require('../../../constants/app-constants');
var Actions = require('../../../actions/pageActions/channelActions');
var Store = require('../../../stores/pagesStore');
var Events = require('../../../constants/events');
var Button = require('../../common/button');
var $ = require('jquery');

var Channel = React.createClass({
	componentWillMount: function () {
		Store.on(Events.pages.channel.CHANNEL_ADD_TRACKS, this.onChannelAddTracks);
		Store.on(Events.server.channel.TRACK_SEARCH_RESPONSE, this.onTrackSearchResponse);
		Store.on(Events.pages.channel.TRACK_ADDED_TO_CHANNEL, this.onTrackAddedToChannel);
		Store.on(Events.pages.channel.CHANNEL_STARTED, this.onChannelStarted);
	},

	componentDidMount: function () {
		$('#addTracks').hide();
		$('#startChannel').hide();
	},

	getInitialState: function () {
		return {
			tracks: [],
			currentStep: 0,
			channelId: null,
			isLoading: false,
			selectedTracks: []
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
					<i className="large unmute aligned icon"></i>

					<div className="content">
						<a className="header">{track.title}</a>
					</div>
				</div>
			);
		});
	},

	getSelectedTracks: function () {
		return this.state.selectedTracks.map(function (track, index) {
			return (
				<div className="item" key={index}>
					<i className="sound large aligned icon"></i>

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

		$('.result-box').show();
	},

	onTrackAddedToChannel: function (data) {
		if (!data.error) {
			this.setState({});
		}
	},

	onChannelAddTracks: function (data) {
		if (!data.error) {
			this.setState({
				currentStep: 1,
				channelId: data.channelId
			});

			$('#createChannel').hide();
			$('#startChannel').hide();
			$('#addTracks').show();
			$('.result-box').hide();
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

		var selectedTracks = this.state.selectedTracks;
		selectedTracks.push(track);

		this.setState({
			selectedTracks: selectedTracks
		});
	},

	onDoneButtonClicked: function () {
		Actions.startChannel({
			channelId: this.state.channelId
		});
	},

	onChannelStarted: function (data) {
		this.setState({
			currentStep: 2,
			channelId: data.channelId
		});

		$('#createChannel').hide();
		$('#addTracks').hide();
		$('#startChannel').show();
		$('.result-box').hide();
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

					<div className="ui icon message attached">
						<i className="inbox icon"></i>

						<div className="content">
							<div className="header">
								Choose a name for your radio channel
							</div>
							<p>Listeners will see this name in channels list.</p>
						</div>
					</div>
					<form className="ui form attached segment">
						<div className="field">
							<label>Channel Name</label>
							<input type="text" ref="channelName" name="channel-name" placeholder="Channel Name"/>
						</div>
						<button onClick={this.onCreateChannelButtonClick} className="ui button" type="button">Create
						</button>
					</form>
				</div>
				<div id="addTracks">
					<h1 className="ui header">Add tracks to channel</h1>

					<div className="ui icon message">
						<i className="inbox icon"></i>

						<div className="content">
							<div className="header">
								Fill your channel
							</div>
							<p>Search for tracks and add those to your new channel</p>
						</div>
					</div>
					<h4 className="ui horizontal divider header"></h4>
					<div className="ui search focus">
						<div className={searchBoxClassList}>
							<input onKeyPress={this.onSearchChanged} className="prompt" type="text"
							       placeholder="Search Tracks" autoComplete="off"/>
							<i className="pied piper alternate icon"></i>
						</div>
					</div>
					<div className="ui container">
						<div className="attached segment result-box">
							<h4 className="ui medium horizontal divider header">
								Channel's track list
							</h4>

							<div className="ui large aligned divided list relaxed">
								{this.getSelectedTracks()}
								<Button text="Start" disabled={!this.state.selectedTracks.length}
								        onClick={this.onDoneButtonClicked}/>
								<br/>
							</div>
							<h4 className="ui medium horizontal divider header">
								Search results
							</h4>

							<div className="ui middle aligned divided list relaxed">
								{this.getTracks()}
							</div>
						</div>
					</div>
				</div>
				<div id="startChannel">
					<h1 className="ui header">Start your channel</h1>

					<div className="ui container">
						<h4 className="ui horizontal divider header"></h4>

						<div className="attached segment">
							<div className="ui positive message">
								<div className="header">
									Your channel has been started.
								</div>
								<p>Full list of channels can be found <a href="/channels">here.</a>
									Start listening to your <a href={'/api/channel/listen/' + this.state.channelId}>
										channel.</a></p>
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