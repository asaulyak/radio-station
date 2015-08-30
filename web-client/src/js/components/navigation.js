var React = require('react');
var Link = require('react-router-component').Link;

var Navigation = React.createClass({
	render: function () {
		return (
			<nav className="ui menu inverted">
				<h3 className="header item">Online Radio</h3>
				<Link href="/" className="item active">Home</Link>
				<Link href="/about" className="item">About</Link>
				<Link href="/channel" className="item">Create channel</Link>
				<Link href="/channels" className="item">Browse channels</Link>
			</nav>
		);
	}
});

module.exports = Navigation;