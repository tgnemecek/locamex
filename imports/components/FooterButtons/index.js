import React from 'react';
import { Link, Route } from 'react-router-dom';

export default class FooterButtons extends React.Component {

  selectNumber = () => {
    var length = this.props.buttons.length;
    switch (length) {
      case 2:
        return this.renderTwoButtons();
      case 3:
        return this.renderThreeButtons();
      default:
        return null;
    }
  }

  renderTwoButtons = () => {
    var style = {};
    var buttons = this.props.buttons;

    if (!buttons) return null;

    return buttons.map((button, i) => {
      if (i == 0) {
        style = {}
      } else style = {marginLeft: "1%"}
      var className = "button ";
      className += button.className || '';
      var text = button.text;
      var onClick = button.onClick || null;
      var type = button.type || "button";
      return <button
                  key={i}
                  type={type}
                  style={style}
                  className={className}
                  onClick={onClick}>{text}</button>
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
      return <button
                  key={i}
                  type={type}
                  style={style}
                  className={className}
                  onClick={onClick}>{text}</button>
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