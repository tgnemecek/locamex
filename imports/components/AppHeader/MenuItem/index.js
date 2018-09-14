import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filteredPages: [] };
  }
  componentDidMount = () => {
    var filteredPages = [];
    var pagesDatabase = this.props.pagesDatabase;
    var pages = this.props.pages;
    this.tracker = Tracker.autorun(() => {
      var user = Meteor.user() || {};
      var allowedPages = user.pages || [];
      for (var i = 0; i < allowedPages.length; i++) {
        for (var j = 0; j < pagesDatabase.length; j++) {
          if (allowedPages[i] == pagesDatabase[j]._id && pages.includes(pagesDatabase[j]._id)) {
            filteredPages.push(pagesDatabase[j]);
            break;
          }
        }
      }
      this.setState({ filteredPages });
    })
  }
  componentWillUnmount = () => {
    this.tracker.stop();
  }
  renderMultiple = () => {
    return this.state.filteredPages.map((filteredPage, i) => {
      return <Link key={i} to={filteredPage.link}>{filteredPage.description}</Link>
    })
  }
  render() {
    if (this.state.filteredPages.length > 1) {
      return (
        <div className="menu-item">
          {this.props.name}
          <div className="menu-item__dropbox">
            {this.renderMultiple()}
          </div>
        </div>
      )
    } else if (this.state.filteredPages.length === 1) {
      return (
          <Link className="menu-item" to={this.state.filteredPages[0].link}>{this.state.filteredPages[0].description}</Link>
      )
    } else return null;
  }
}