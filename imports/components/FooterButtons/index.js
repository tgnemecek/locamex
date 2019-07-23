import React from 'react';

import Button from '/imports/components/Button/index';

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
    var style = {flexBasis: "100%"};
    var button = this.props.buttons[0];

    if (!button) return null;

    var className = "button ";
    className += button.className || '';
    var text = button.text;
    var onClick = button.onClick || null;
    var type = button.type || "button";
    return (
      <Button
        type={type}
        style={style}
        className={className}
        onClick={onClick}>{text}</Button>
    )
  }

  renderTwoButtons = () => {
    var style = {};
    var buttons = this.props.buttons;

    if (!buttons) return null;

    return buttons.map((button, i) => {
      if (i == 0) {
        style = {marginRight: "0.5%"}
      } else style = {marginLeft: "0.5%"}
      var className = "button ";
      className += button.className || '';
      var text = button.text;
      var onClick = button.onClick || null;
      var type = button.type || "button";
      return <Button
                  key={i}
                  type={type}
                  style={style}
                  className={className}
                  onClick={onClick}>{text}</Button>
    })
  }

  renderThreeButtons = () => {
    var style = {};
    var buttons = this.props.buttons;

    if (!buttons) return null;

    return buttons.map((button, i) => {
      if (i === 0) {
        style = {flexBasis: "100%"};
      } else if (i === 1) {
        style = {};
      } else if (i === 2) {
        style = {marginLeft: "1%"};
      }
      var className = "button ";
      className += button.className || '';
      var text = button.text;
      var onClick = button.onClick || null;
      var type = button.type || "button";
      return <Button
                  key={i}
                  type={type}
                  style={style}
                  className={className}
                  onClick={onClick}>{text}</Button>
    })
  }

  render() {
      return (
        <div className="footer-buttons">
          {this.selectNumber()}
        </div>
      )
  }
}