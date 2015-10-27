var React = require('react');

var Button = React.createClass({
	render: function () {
		var buttonClasses = ['ui', 'right', 'floated', 'labeled', 'icon', 'button'];

		this.props.disabled && buttonClasses.push('disabled');

		buttonClasses = buttonClasses.join(' ');

		return (
			<button className={buttonClasses} onClick={this.props.onClick}>
				<i className="right arrow icon"></i>
				{this.props.text}
			</button>
		);
	}
});

module.exports = Button;
