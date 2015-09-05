var React = require('react');
var Navigation = require('./navigation');

var Header = React.createClass({
	render: function () {
		return (
			<header>
				<Navigation/>
			</header>
		);
	}
});

module.exports = Header;