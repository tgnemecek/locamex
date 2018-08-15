import React from 'react';

export default class FooterButtons extends React.Component {

  renderButtons = () => {
    var style = {};
    var className = "button ";
    var text;

    if (!this.props.buttons) return null;

    return this.props.buttons.map((button, i) => {
      if (i == 0) {
        style = {marginLeft: "0"}
      } else style = {marginLeft: "1%"}

      className += button.className;
      text = button.text;
      return <button
                key={i}
                type="button"
                style={style}
                className={className}
                onClick={button.onClick}>{text}</button>
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