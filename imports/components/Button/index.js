import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilm, faCarCrash, faCode } from '@fortawesome/free-solid-svg-icons';

export default class Button extends React.Component {
  conditionalRendering = () => {
    if (this.props.icon) {
      return (
        <button
          onClick={() => this.props.onClick({target: {value: this.props.value, name: this.props.name}})}
          className={"icon " + this.props.className}
          style={this.props.style}>
          <FontAwesomeIcon icon={ICON_SET[this.props.icon]} size={this.props.size || "1x"} style={this.props.iconStyle} />
        </button>
      )
    } else return (
      <button {...this.props}>
        {this.props.children}
      </button>
    )
  }

  render() {
    return (
      <>
        {this.conditionalRendering()}
      </>
    )
  }
}

const ICON_SET = {
  faPlus,
  faFilm,
  faCarCrash,
  faCode
}