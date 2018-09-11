import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    var usersDatabase = this.props.usersDatabase;
    var pagesDatabase = this.props.pagesDatabase;
    var pages = this.props.pages;
    var allowedPages = [];
    for (var i = 0; i < usersDatabase.length; i++) {
      if (usersDatabase[i]._id == Meteor.userId()){
        allowedPages = usersDatabase[i].pages;
        break;
      }
    }
    this.filteredPages = [];
    for (var i = 0; i < pagesDatabase.length; i++) {
      if (allowedPages.includes(pagesDatabase[i]._id) && pages.includes(pagesDatabase[i]._id)) {
        this.filteredPages.push(pagesDatabase[i]);
      }
    }
  }

  renderMultiple = () => {
    return this.filteredPages.map((filteredPage, i) => {
      return <Link key={i} to={filteredPage.link}>{filteredPage.description}</Link>
    })
  }

  render() {
    if (this.filteredPages.length > 1) {
      return (
        <div className="menu-item">
          {this.props.name}
          <div className="menu-item__dropbox">
            {this.renderMultiple()}
          </div>
        </div>
      )
    } else if (this.filteredPages.length === 1) {
      return (
          <Link className="menu-item" to={this.filteredPages[0].link}>{this.filteredPages[0].description}</Link>
      )
    } else return null;
  }
}