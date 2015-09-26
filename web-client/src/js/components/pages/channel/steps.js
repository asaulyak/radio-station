var React = require('react');
var channelActions = require('../../../actions/pageActions/channelActions');
var Events = require('../../../constants/events');
var pagesStore = require('../../../stores/pagesStore');

module.exports = React.createClass({
	steps: [
		'chooseName',
		'addTracks',
		'startChannel'
	],

	getInitialState: function () {
		return {
			step: this.props.currentStep
		};
	},

	getSteps: function () {
		var steps = this.props.steps || [];

		return steps.map(function (step) {
			return (
				<div key={step.id } className={(step.id === this.steps[this.props.currentStep] ? 'active' : '') + ' step'}>
					<i className={step.icon + ' icon'}></i>

					<div className="content">
						<div className="title">{step.displayName}</div>
						<div className="description">{step.description}</div>
					</div>
				</div>
			);
		}.bind(this));
	},

	render: function () {
		var steps = this.getSteps();

		return (
			<div className="ui container">
				<div className="ui horizontal divider">Step {this.props.currentStep + 1} out of {this.props.steps.length}</div>
				<div className="ui steps attached">
					{steps}
				</div>
			</div>
		);
	}
});