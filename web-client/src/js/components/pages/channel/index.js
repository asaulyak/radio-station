var React = require('react');
var Steps = require('./steps');
var channelActions = require('../../../actions/pageActions/channelActions');

var Channel = React.createClass({
	render: function () {
		setTimeout(function () {
			channelActions.stepMove('addTracks');
		}, 2000);
		return (
			<div className="ui raised very padded container segment">
				<h1 className="ui header">Create new channel</h1>

				<form className="ui form">
					<div className="field">
						<label>Channel Name</label>
						<input type="text" name="first-name" placeholder="Channel Name"/>
					</div>

					<div className="field">
						<div className="ui checkbox">
							<input type="checkbox" tabIndex="0" className="hidden"/>
							<label>I agree to the Terms and Conditions</label>
						</div>
					</div>
					<button className="ui button" type="submit">Create</button>
				</form>
				<Steps/>
			</div>
		);
	}
});

module.exports = Channel;