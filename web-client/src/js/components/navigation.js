var React = require('react');

var Navigation = React.createClass({
	render: function () {
		return ( <nav className="ui menu inverted">
					<h3 className="header item">Online Radio</h3>
					<a href="#" className="item active">Home</a>
					<a href="#" className="item">About</a>
					<a href="#" className="item">Create channel</a>
					<a href="#" className="item">Browse channels</a>
				</nav>
		);
	}
});

module.exports = Navigation;