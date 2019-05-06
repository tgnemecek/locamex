import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link, Redirect } from 'react-router-dom';

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
        if (pathname == appStructure[i].pages[j].link) {
          this.setState({ currentPage: appStructure[i].pages[j] });
          return;
        }
      }
    }
  }

  renderMenuItems = () => {
    var filteredPages = [];
    if (!this.props.user.type) return null;
    if (this.props.user.type !== 'administrator') {
      var allowedPages = userTypes.find((page) => page.type === this.props.user.type).pages;
      appStructure.forEach((group, i) => {
        var tempObject = { ...group, pages: [] };
        group.pages.forEach((page) => {
          if (page.name === "dashboard") tempObject.pages.push(page);
          if (allowedPages.includes(page.name)) tempObject.pages.push(page);
        })
        filteredPages.push(tempObject);
      })
    } else filteredPages = appStructure;

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
        <img src="https://s3-sa-east-1.amazonaws.com/locamex-app/app-required/logo-sistema-branco_336x104_21-09-2018.png" className="header__logo"/>
        <div className="header">
          <h1 className="header__title">{this.state.currentPage.title}</h1>
          <div className="header__menu">
          {this.renderMenuItems()}
          <button className="header__logout" onClick={() => Meteor.logout()}>Sair</button>
          </div>
        </div>
      </div>
    )
  }
}