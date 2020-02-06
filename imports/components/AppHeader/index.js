import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link, Redirect } from 'react-router-dom';
import Icon from '/imports/components/Icon/index';
import { appStructure } from './app-structure/index';
import { userTypes } from '/imports/startup/user-types/index';
import MenuItem from './MenuItem/index'

export default class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: {}
    }
  };

  componentDidMount() {
    this.updateLocation();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.updateLocation();
    }
  }

  updateLocation = () => {
    var pathname = this.props.location.pathname;
    for (var i = 0; i < appStructure.length; i++) {
      for (var j = 0; j < appStructure[i].pages.length; j++) {
        if (pathname.includes(appStructure[i].pages[j].link)) {
          this.setState({ currentPage: appStructure[i].pages[j] });
          return;
        }
      }
    }
  }

  renderMenuItems = () => {
    return null;
    var filteredPages = [];
    var currentUserType = this.props.user.type;
    if (!this.props.user.type) return null;
    var allowedPages = [];
    if (currentUserType !== "administrator") {
      allowedPages = userTypes[currentUserType].pages;
    }
    appStructure.forEach((group, i) => {
      var tempObject = { ...group, pages: [] };
      group.pages.forEach((page) => {
        if (page.visible) {
          if (currentUserType === 'administrator') {
            tempObject.pages.push(page);
          } else if (page.name === "dashboard") {
            tempObject.pages.push(page);
          } else if (allowedPages.includes(page.name)) {
            tempObject.pages.push(page);
          }
        }
      })
      filteredPages.push(tempObject);
    })

    return filteredPages.map((group, i) => {
      return (
        <MenuItem
          key={i}
          title={group.groupTitle}
          pages={group.pages}/>
      )
    })
  }

  render() {
    return (
      <div className="header__background">
        <Link to="/">
          <img src="https://s3-sa-east-1.amazonaws.com/locamex-app/app-required/logo-sistema-branco_336x104_21-09-2018.png" className="header__logo"/>
        </Link>
        <div className="header">
          <h1 className="header__title">{this.state.currentPage.title}</h1>
          <div className="header__mobile-dropdown">
            <button className="header__mobile-menu-icon">
              <Icon icon="menu" size="2x"/>
            </button>
            <div className="header__menu">
            {this.renderMenuItems()}
            <div className="menu-item">
              <button onClick={() => Meteor.logout()}>Sair</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}