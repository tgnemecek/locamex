import React from 'react';

export default class FooterButtons extends React.Component {

  renderButtons = () => {
    var className = "button ";
    var text;

    return this.props.buttons.map((button, i) => {
      className += button.className;
      text = button.text;
      return <button key={i} type="button" className={className} onClick={button.onClick}>{text}</button>
    })
  }

  render() {
      return (
        <div>
          {this.renderButtons()}
        </div>
      )
  }
}