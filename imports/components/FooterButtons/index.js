import React from 'react';
import { Link } from 'react-router';

export default class FooterButtons extends React.Component {

  renderButtons = () => {
    var style = {};
    var text;

    if (!this.props.buttons) return null;

    return this.props.buttons.map((button, i) => {
      if (i == 0) {
        style = {marginLeft: "0"}
      } else style = {marginLeft: "1%"}
      var className = "button ";
      className += button.className;
      text = button.text;
      if (button.type === 'link') {
        return <Link className={className} to={button.onClick}>{text}</Link>
      } else {
        return <button
                  key={i}
                  type="button"
                  style={style}
                  className={className}
                  onClick={button.onClick}>{text}</button>
      }
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