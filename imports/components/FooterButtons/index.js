import React from 'react';
import { Link } from 'react-router-dom';

export default class FooterButtons extends React.Component {

  renderButtons = () => {
    var style = {};

    if (!this.props.buttons) return null;

    return this.props.buttons.map((button, i) => {
      if (i == 0) {
        style = {marginLeft: "0"}
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

  render() {
      return (
        <div className="footer-buttons">
          {this.renderButtons()}
        </div>
      )
  }
}