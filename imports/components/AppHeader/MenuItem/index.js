import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    var allowedPages = this.props.allowedPages;
    var allPages = this.props.pagesDatabase;
    this.filteredPages = [];
    for (var i = 0; i < allPages.length; i++) {
      if (allowedPages.includes(allPages[i]._id)) {
        this.filteredPages.push(allPages[i]);
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