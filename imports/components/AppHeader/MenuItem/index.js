import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {
  renderMultiple = (filteredPages) => {
    return filteredPages.map((filteredPage, i) => {
      return <Link key={i} to={filteredPage.link}>{filteredPage.description}</Link>
    })
  }
  render() {
    var filteredPages = [];
    var pagesDatabase = this.props.pagesDatabase;
    var pages = this.props.pages;

    var allowedPages = this.props.user.profile.pages || [];
    for (var i = 0; i < allowedPages.length; i++) {
      for (var j = 0; j < pagesDatabase.length; j++) {
        if (allowedPages[i] == pagesDatabase[j]._id && pages.includes(pagesDatabase[j]._id)) {
          filteredPages.push(pagesDatabase[j]);
          break;
        }
      }
    }
    if (filteredPages.length > 1) {
      return (
        <div className="menu-item">
          {this.props.name}
          <div className="menu-item__dropbox">
            {this.renderMultiple(filteredPages)}
          </div>
        </div>
      )
    } else if (filteredPages.length === 1) {
      return (
          <Link className="menu-item" to={filteredPages[0].link}>{filteredPages[0].description}</Link>
      )
    } else return null;
  }
}