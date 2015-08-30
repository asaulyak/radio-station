var React = require('react');
var Header = require('./header');

var Template = React.createClass({
	render: function () {
		return (
			<div className="container">
				<Header/>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Template;