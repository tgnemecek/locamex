import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faFileExcel,
  faSyncAlt,
  faEdit,
  faImages,
  faSearch,
  faLevelUpAlt,
  faLevelDownAlt,
  faTimes,
  faExclamationCircle,
  faPrint,
  faDollarSign,
  faArrowLeft,
  faArrowRight,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const ICON_SET = {
  new: faPlus,
  report: faFileExcel,
  transaction: faSyncAlt,
  edit: faEdit,
  image: faImages,
  search: faSearch,
  send: faLevelUpAlt,
  receive: faLevelDownAlt,
  not: faTimes,
  warning: faExclamationCircle,
  print: faPrint,
  money: faDollarSign,
  arrowLeft: faArrowLeft,
  arrowRight: faArrowRight,
  help: faQuestionCircle
}

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.Component = this.props.to ? (props) => <Link {...props} /> : (props) => <button {...props} />
  }

  style = () => {
    return {
      cursor: this.props.onClick ? "pointer" : "default",
      ...this.props.style
    }
  }

  iconStyle = () => {
    return {
      cursor: (this.props.onClick || this.props.to) ? "pointer" : "default",
      ...this.props.iconStyle
    }
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick({target: {value: this.props.value, name: this.props.name}});
    }
  }

  conditionalRendering = () => {
    if (this.props.icon) {
      return (
        <this.Component
          {...this.props}
          onClick={this.onClick}
          className={"icon " + (this.props.className || "")}
          style={this.style()}>
          <FontAwesomeIcon icon={ICON_SET[this.props.icon]} size={this.props.size || "1x"} style={this.iconStyle()} />
        </this.Component>
      )
    } else return (
      <this.Component {...this.props}>
        {this.props.children}
      </this.Component>
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