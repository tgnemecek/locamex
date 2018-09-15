import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {
  renderMultiple = (filteredPages) => {
    return filteredPages.map((filteredPage, i) => {
      return <Link key={i} to={filteredPage.link}>{filteredPage.title}</Link>
    })
  }
  render() {
    var filteredPages = [];
    var pages = this.props.pages;
    var allowedPages = this.props.allowedPages || [];

    for (var i = 0; i < pages.length; i++) {
      if (allowedPages.includes(pages[i].name)) {
        filteredPages.push(pages[i]);
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
          <Link className="menu-item" to={filteredPages[0].link}>{filteredPages[0].title}</Link>
      )
    } else return null;
  }
}