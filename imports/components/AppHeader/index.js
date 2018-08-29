import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router';

import { PageGroup } from '/imports/api/page-groups/index';
import { UserTypes } from '/imports/api/user-types/index';

import MenuItem from './MenuItem/index'

export default class AppHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageGroup: []
    }
  };

  componentDidMount() {
    this.categoriesTracker = Tracker.autorun(() => {
      Meteor.subscribe('categoriesPub');
      const pageGroup = PageGroup.find({}).fetch();
      this.setState({ pageGroup });
    })
  }

  render() {
    return(
      <div className="header">
        <h1 className="header__title">{this.props.title}</h1>
        {this.state.pageGroup.map((pageGroup) => {
          return <MenuItem
            key={pageGroup._id}
            categoryId={pageGroup._id}
            categoryName={pageGroup.name}
            categoryPages={pageGroup.pages}
          />
          })}
        <button className="button button--link-text header__logout" onClick={() => Accounts.logout()}>Sair</button>
      </div>
    )
  }
}
//
// AppHeader.propTypes = {
//   title: React.PropTypes.string.isRequired
// };