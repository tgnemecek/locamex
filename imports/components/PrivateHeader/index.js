import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router';

import { Categories } from '/imports/api/categories';
import { UserTypes } from '/imports/api/user-types';

import MenuItem from './MenuItem/index'

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
          <button className="button button--link-text header__logout" onClick={() => Accounts.logout()}>Logout</button>
        </div>
      </div>
    )
  }
}
//
// PrivateHeader.propTypes = {
//   title: React.PropTypes.string.isRequired
// };