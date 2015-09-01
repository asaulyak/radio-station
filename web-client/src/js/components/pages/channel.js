var React = require('react');

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
							<input type="checkbox" tabIndex="0" className="hidden"/>
							<label>I agree to the Terms and Conditions</label>
						</div>
					</div>
					<button className="ui button" type="submit">Create</button>
				</form>
				<div className="ui horizontal divider">Step 1 of 3</div>
				<div className="ui container">
					<div className="ui steps attached">
						<div className="active step">
							<i className="write icon"></i>

							<div className="content">
								<div className="title">Choose name</div>
								<div className="description">Choose your channel's name</div>
							</div>
						</div>
						<div className="step">
							<i className="music icon"></i>

							<div className="content">
								<div className="title">Add tracks</div>
								<div className="description">Fill your channel with tracks</div>
							</div>
						</div>
						<div className="step">
							<i className="announcement icon"></i>

							<div className="content">
								<div className="title">Start channel</div>
								<div className="description">Start broadcasting</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Channel;