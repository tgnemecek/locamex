import React from 'react';
import { Link } from 'react-router';

export default class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  openPages = () => {
    this.setState({ isOpen: true });
  }

  renderItems = () => {
    var allowedPages = this.props.allowedPages;
    var allPages = this.props.pagesDatabase;
    var filteredPages = [];

    for (var i = 0; i < allPages.length; i++) {
      if (allowedPages.includes(allPages[i]._id)) {
        filteredPages.push(allPages[i]);
      }
    }
    return filteredPages.map((filteredPage, i) => {
      return <Link className="button button--link" key={i} to={filteredPage.link}>{filteredPage.description}</Link>
    })
  }

  render() {
    return(
      <div className="header__menu-item">
        <button onClick={this.openPages}>{this.props.name}</button>
        <div className="header__menu-item--content">
          {this.renderItems()}
        </div>
      </div>
    )
  }
}