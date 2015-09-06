var React = require('react');
var Router = require('react-router-component');
var AppStore = require('../../stores/app-store');
var Events = require('../../constants/events');

var Link = Router.Link;

var NavigationItem = React.createClass({
	getClassName: function () {
		var classList = ['item'];

		if (this.state.isActive) {
			classList.push('active');
		}
		return classList.join(' ');
	},

	getInitialState: function () {
		var currentRoute = Router.environment.pathnameEnvironment.path;

		return {
			isActive: this.props.route === currentRoute
		};
	},

	setActive: function (isActive) {
		this.setState({
			isActive: !!isActive
		});
	},

	componentWillMount: function () {
		AppStore.on(Events.routes.ROUTE_CHANGED, function (path) {
			this.setActive(this.props.route === path);
		}.bind(this));
	},

	render: function () {
		return (
			<Link key={this.props.route} href={this.props.route}
					className={this.getClassName()}>
				{this.props.displayName}
			</Link>
		);
	}
});

module.exports = NavigationItem;