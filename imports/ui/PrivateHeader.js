import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router';

import { Categories } from '../api/categories';
import { UserTypes } from '../api/user-types';

export default class PrivateHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
  };

  componentDidMount() {
    this.categoriesTracker = Tracker.autorun(() => {
      Meteor.subscribe('categoriesPub');
      const categories = Categories.find({}).fetch();
      this.setState({ categories });
    })
  }

  render() {
    return(
      <div className="header">
        <div className="header__content">
          <h1 className="header__title">{this.props.title}</h1>
          {this.state.categories.map((category) => {
            return <MenuItem
              key={category._id}
              categoryId={category._id}
              categoryName={category.name}
              categoryPages={category.pages}
            />
            })}
          <button className="button button--link-text" onClick={() => Accounts.logout()}>Logout</button>
        </div>
      </div>
    )
  }
}

PrivateHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  };

  openPages() {
    this.setState({isOpen: true});
  }

  render() {
    return(
      <div className="dropdown">
        <button className="button--header" onClick={this.openPages.bind(this)}>{this.props.categoryName}</button>
        <div className="dropdown-content">
          {this.props.categoryPages.map((category) => {
            return <Link className="button button--link button--header-page" to={category.link}>{category.name}</Link>
            })}
        </div>
      </div>
    )
  }
}