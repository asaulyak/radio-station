var React = require('react');
var Router = require('react-router-component');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');
var AppConstants = require('../constants/app-constants');

var Link = Router.Link;

var NavigationItem = React.createClass({
		getClassName: function () {
			var classList = ['item'];

			if (this.state.isActive) {
				classList.push('active');
			}
			return classList.join(' ');
		},

		getInitialState: function() {
			return {
				isActive: false
			};
		},

		setActive: function(isActive){
			this.setState({
				isActive: !!isActive
			});
		},

		onClick: function () {
			AppActions.resetRoute();
			this.setActive(true);
		},

		componentWillMount: function () {
			AppStore.on(AppConstants.RESET_ROUTE, function () {
				this.setActive(false);
			}.bind(this));

			var currentRoute = Router.environment.pathnameEnvironment.path;
			this.setActive(this.props.route === currentRoute);
		},

		render: function () {
			return (
				<Link key={this.props.route} onClick={this.onClick} href={this.props.route} className={this.getClassName()}>
					{this.props.displayName}
				</Link>
			);
		}
	})
	;

module.exports = NavigationItem;