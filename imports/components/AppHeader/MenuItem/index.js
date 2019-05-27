import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {
  renderMultiple = () => {
    var pages = this.props.pages;
    return pages.map((page, i) => {
      return <Link key={i} to={page.link}>{page.title}</Link>
    })
  }
  render() {
    var pages = this.props.pages;
    if (pages.length > 1) {
      return (
        <div className="menu-item">
          {this.props.title}
          <div className="menu-item__dropbox">
            {this.renderMultiple()}
          </div>
        </div>
      )
    } else if (pages.length === 1) {
      return <Link className="menu-item" to={pages[0].link}>{pages[0].title}</Link>
    } else return null;
  }
}