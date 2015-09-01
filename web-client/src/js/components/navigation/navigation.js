var React = require('react');
var Router = require('react-router-component');
var Link = Router.Link;
var NavigationItem = require('./navigationItem');

var Navigation = React.createClass({
	getInitialState: function () {
		return {
			links: []
		};
	},

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
			item.isActive = item.route === currentRoute;

			return item;
		});
	},

	render: function () {
		var links = this.getNavigationItems().map(function (item) {
			return (
				<NavigationItem key={item.route} displayName={item.displayName} isActive={item.isActive} route={item.route}/>
			);
		});

		return (
			<nav className="ui menu inverted">
				<Link href="/">
					<h3 className="header item"><i className="icon pied piper alternate inverted"></i> Online Radio</h3>
				</Link>
				{links}
			</nav>
		);
	}
});

module.exports = Navigation;