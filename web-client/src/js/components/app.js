var React = require('react');
var Home = require('./pages/home');
var Channel = require('./pages/channel');
var Channels = require('./pages/channels');
var About = require('./pages/about');
var Layout = require('./layout');
var Router = require('react-router-component');
var AppDispatcher = require('../dispatchers/app-dispatcher');
var Actions = require('../actions/routerActions');

var Locations = Router.Locations;
var Location = Router.Location;

var App = React.createClass({
	render: function () {
		var onNavigation = function (path) {
			Actions.navigate(path);
		};

		return (
			<Layout>
				<Locations onBeforeNavigation={onNavigation}>
					<Location path="/" handler={Home}/>
					<Location path="/about" handler={About}/>
					<Location path="/channel" handler={Channel}/>
					<Location path="/channels" handler={Channels}/>
				</Locations>
			</Layout>
		);
	}
});

module.exports = App;