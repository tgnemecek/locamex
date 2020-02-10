import React from 'react';
import Icon from '/imports/components/Icon/index';

export default class FooterButtons extends React.Component {

  selectNumber = () => {
    var length = this.props.buttons.length;
    switch (length) {
      case 1:
        return this.renderOneButton();
      case 2:
        return this.renderTwoButtons();
      case 3:
        return this.renderThreeButtons();
      default:
        return null;
    }
  }

  renderOneButton = () => {
    var button = this.props.buttons[0];
    if (!button) return null;
    var className = "button grid-span-2 ";
    className += button.className || '';
    var text = button.text;
    var onClick = button.onClick || null;
    var type = button.type || "button";
    return (
      <button
        disabled={this.props.disabled}
        type={type}
        className={className}
        onClick={onClick}>{text}</button>
    )
  }

  renderTwoButtons = () => {
    var buttons = this.props.buttons;
    if (!buttons) return null;
    return buttons.map((button, i) => {
      var className = "button ";
      className += button.className || '';
      var text = button.text;
      var onClick = button.onClick || null;
      var type = button.type || "button";
      return <button
                  key={i}
                  disabled={this.props.disabled}
                  type={type}
                  className={className}
                  onClick={onClick}>{text}</button>
    })
  }

  renderThreeButtons = () => {
    var buttons = this.props.buttons;
    if (!buttons) return null;
    return buttons.map((button, i) => {
      var className = "button ";
      className += button.className || '';
      className += i === 0 ? " grid-span-2" : "";
      var text = button.text;
      var onClick = button.onClick || null;
      var type = button.type || "button";
      return <button
                  key={i}
                  disabled={this.props.disabled}
                  type={type}
                  className={className}
                  onClick={onClick}>{text}</button>
    })
  }

  render() {
    return (
      <div className="footer-buttons">
        {this.props.disabled ? null :
          this.selectNumber()}
      </div>
    )
  }
}