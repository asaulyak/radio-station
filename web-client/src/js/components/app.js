var React = require('react');
var Index = require('./index');
var Channel = require('./pages/channel');
var Channels = require('./pages/channels');
var About = require('./pages/about');
var Template = require('./template');
var Router = require('react-router-component');

var Locations = Router.Locations;
var Location = Router.Location;

var App = React.createClass({
	render: function () {
		return (
			<Template>
				<Locations>
					<Location path="/" handler={Index}/>
					<Location path="/about" handler={About}/>
					<Location path="/channel" handler={Channel}/>
					<Location path="/channels" handler={Channels}/>
				</Locations>
			</Template>
		);
	}
});

module.exports = App;