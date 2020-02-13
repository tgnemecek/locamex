import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faCalendarAlt,
  faCheck,
  faCloudUploadAlt,
  faCopy,
  faDollarSign,
  faEdit,
  faExclamationCircle,
  faExternalLinkAlt,
  faFileExcel,
  faFileInvoiceDollar,
  faFilePdf,
  faImages,
  faPlus,
  faPrint,
  faQuestionCircle,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
  faStar,
  faSyncAlt,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const ICON_SET = {
  arrowLeft: faArrowLeft,
  arrowRight: faArrowRight,
  calendar: faCalendarAlt,
  checkmark: faCheck,
  copy: faCopy,
  edit: faEdit,
  help: faQuestionCircle,
  image: faImages,
  invoice: faFileInvoiceDollar,
  link: faExternalLinkAlt,
  receive: faSignInAlt,
  search: faSearch,
  send: faSignOutAlt,
  menu: faBars,
  money: faDollarSign,
  new: faPlus,
  not: faTimes,
  pdf: faFilePdf,
  print: faPrint,
  report: faFileExcel,
  star: faStar,
  transaction: faSyncAlt,
  warning: faExclamationCircle,
  upload: faCloudUploadAlt,
  user: faUser
}

export default class Icon extends React.Component {
  className = () => {
    var fromProps = this.props.className || "";
    return "icon " + fromProps;
  }

  render() {
    return (
      <div className={this.className()}>
        <FontAwesomeIcon
          {...this.props}
          icon={ICON_SET[this.props.icon]}
          size={this.props.size || "1x"}/>
      </div>
    )
  }
}