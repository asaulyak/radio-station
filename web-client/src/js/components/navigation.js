var React = require('react');
var Router = require('react-router-component');
var Link = Router.Link;

var Navigation = React.createClass({
	getNavigationItems: function () {
		var navigationItems = [
			{
				route: '/',
				displayName: 'Home'
			},
			{
				route: '/about',
				displayName: 'About'
			},
			{
				route: '/channel',
				displayName: 'Create channel'
			},
			{
				route: '/channels',
				displayName: 'Browse channels'
			}
		];

		var currentRoute = Router.environment.pathnameEnvironment.path;

		return navigationItems.map(function (item) {
			item.className = item.route === currentRoute ? 'active' : '';

			return item;
		});
	},

	render: function () {
		var links = this.getNavigationItems().map(function (item) {
			return (
				<Link key={item.route} href={item.route} className={'item ' + item.className}>{item.displayName}</Link>
			);
		});
		return (
			<nav className="ui menu inverted">
				<h3 className="header item">Online Radio</h3>
				{links}
			</nav>
		);
	}
});

module.exports = Navigation;