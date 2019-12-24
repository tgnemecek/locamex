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
  faSignOutAlt,
  faSignInAlt,
  faTimes,
  faExclamationCircle,
  faPrint,
  faDollarSign,
  faArrowLeft,
  faArrowRight,
  faQuestionCircle,
  faCopy,
  faFilePdf,
  faCloudUploadAlt,
  faStar,
  faCalendarAlt,
  faFileInvoiceDollar,
  faBars
} from '@fortawesome/free-solid-svg-icons';

const ICON_SET = {
  new: faPlus,
  report: faFileExcel,
  transaction: faSyncAlt,
  edit: faEdit,
  image: faImages,
  search: faSearch,
  send: faSignOutAlt,
  receive: faSignInAlt,
  not: faTimes,
  warning: faExclamationCircle,
  print: faPrint,
  money: faDollarSign,
  arrowLeft: faArrowLeft,
  arrowRight: faArrowRight,
  help: faQuestionCircle,
  copy: faCopy,
  pdf: faFilePdf,
  upload: faCloudUploadAlt,
  star: faStar,
  calendar: faCalendarAlt,
  invoice: faFileInvoiceDollar,
  menu: faBars
}

export default class Icon extends React.Component {
  style = () => {
    if (this.props.onClick) {
      return {
        cursor: "pointer",
        ...this.props.style
      }
    } else return {...this.props.style};
  }

  renderIcon = () => {
    return (
      <FontAwesomeIcon
        {...this.props}
        icon={ICON_SET[this.props.icon]}
        size={this.props.size || "1x"}/>
    )
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick({target: {value: this.props.value, name: this.props.name}});
    }
  }

  conditionalRendering = () => {
    var Component;
    if (this.props.to) {
      Component = (props) => <Link {...props} />
    } else if (this.props.onClick) {
      Component = (props) => <button {...props} />
    } else {
      Component = (props) => <span {...props} />
    }
    if (this.props.icon) {
      return (
        <Component
          // {...this.props}
          onClick={this.onClick}
          className={"icon " + (this.props.className || "")}
          style={this.style()}>
          {this.renderIcon()}
        </Component>
      )
    }
  }

  render() {
    return (
      <>
        {/* {this.conditionalRendering()} */}
        {this.renderIcon()}
      </>
    )
  }
}