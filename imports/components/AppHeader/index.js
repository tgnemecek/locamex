import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link, Redirect } from 'react-router-dom';
import { appStructure } from '/imports/api/appStructure/index';
import MenuItem from './MenuItem/index'

export default class AppHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allowedPages: [],
      title: undefined
    }
  };

  componentDidMount() {
    this.updateLocation();
    this.checkUserPages();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.updateLocation();
      this.checkUserPages();
    }
  }

  checkUserPages = () => {
    if (this.props.user) {
      Meteor.call('users.get.pages', this.props.user._id, (err, res) => {
        if (err) console.log(err);
        else if (res) this.setState({ allowedPages: res })
      });
    }
  }

  updateLocation = () => {
    var pathname = this.props.location.pathname;
    for (var i = 0; i < appStructure.length; i++) {
      for (var j = 0; j < appStructure[i].pages.length; j++) {
        if (pathname == appStructure[i].pages[j].link) {
          this.setState({ title: appStructure[i].pages[j].title });
          return;
        }
      }
    }
  }

  renderMenuItems = () => {
    if (!this.state.allowedPages.length) return null;
    return appStructure.map((group, i) => {
      return <MenuItem
        key={i}
        name={group.groupTitle}
        pages={group.pages}
        allowedPages={!i ? ["dashboard"] : this.state.allowedPages}/>
    })
  }

  render() {
    return (
      <div className="header__background">
        <div className="header">
          <h1 className="header__title">{this.state.title}</h1>
          <div className="header__menu">
          {this.renderMenuItems()}
          <button className="header__logout" onClick={() => Meteor.logout()}>Sair</button>
          </div>
        </div>
      </div>
    )
  }
}