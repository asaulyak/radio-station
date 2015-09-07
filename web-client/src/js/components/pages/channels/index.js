var React = require('react');

var Channels = React.createClass({
	getInitialState: function () {
		return {
			channels: [
				'Kiss FM',
				'Top Hits',
				'Solo Piano',
				'Smooth jazz',
				'Soft Rock',
				'Hit FM',
				'Vocal New Age',
				'Hit 70s',
				'Jazz Classics',
				'Love Music',
				'Movie Soundtracks',
				'New Age',
				'Pop Rock',
				'RadioMozart',
				'Roots Reggae',
				'Rocky FM'
			]
		};
	},

	getChannels: function () {
		return this.state.channels.map(function (channel) {
			return (
				<div className="item" key={channel}>
					<div className="right floated content">
						<div className="ui button">Listen</div>
					</div>
					<i className="large video play middle aligned icon"></i>

					<div className="content">
						<a className="header">{channel}</a>
					</div>
				</div>
			);
		});
	},

	render: function () {
		return (
			<div className="ui container">
				<div className="ui segment">
					<h1>Browse Channels</h1>

					<div className="ui middle aligned divided list relaxed">
						{this.getChannels()}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Channels;