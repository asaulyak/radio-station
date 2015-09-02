var React = require('react');
var Steps = require('./steps');

var Channel = React.createClass({
	render: function () {
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
							<input type="checkbox" tabIndex="0"/>
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