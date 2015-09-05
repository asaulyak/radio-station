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
			step: 0
		};
	},

	componentWillMount: function () {
		pagesStore.on(Events.pages.channel.STEP_MOVE, function (e) {
			this.setState({
				step: e.step
			});
		}.bind(this));
	},

	getSteps: function () {
		var steps = [
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

		return steps.map(function (step) {
			return (
				<div key={step.id } className={(step.id === this.steps[this.state.step] ? 'active' : '') + ' step'}>
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
				<div className="ui horizontal divider">Step {this.state.step + 1} out of 3</div>
				<div className="ui steps attached">
					{steps}
				</div>
			</div>
		);
	}
});