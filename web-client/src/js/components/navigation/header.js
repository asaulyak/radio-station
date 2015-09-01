var React = require('react');
var Navigation = require('./navigation');

var Template = React.createClass({
	render: function () {
		return (
			<header>
				<Navigation/>
			</header>
		);
	}
});

module.exports = Template;