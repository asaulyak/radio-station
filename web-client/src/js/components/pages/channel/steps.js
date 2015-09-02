var React = require('react');
var channelActions = require('../../../actions/pageActions/channelActions');
var constants = require('../../../constants/app-constants');
var pagesStore = require('../../../stores/pagesStore');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			step: 'chooseName'
		};
	},

	componentWillMount: function () {
		pagesStore.on(constants.events.pages.channel.STEP_MOVE, function (e) {
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
				<div key={step.id}>
					<div className="ui horizontal divider">Step 1 of 3</div>
					<div className={(step.id === this.state.step ? 'active' : '') + ' step'}>
						<i className={step.icon + ' icon'}></i>

						<div className="content">
							<div className="title">{step.displayName}</div>
							<div className="description">{step.description}</div>
						</div>
					</div>
				</div>
			);
		}.bind(this));
	},

	render: function () {
		var steps = this.getSteps();

		return (
			<div className="ui container">
				<div className="ui steps attached">
					{steps}
				</div>
			</div>
		);
	}
});