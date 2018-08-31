import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router';
import { Pages } from '/imports/api/pages/index';
import MenuItem from './MenuItem/index'

export default class AppHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      users: []
    }
    this.administrative = ["0000", "0002"];
  };

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('pagesPub');
      Meteor.subscribe('usersPub');
      const pages = Pages.find().fetch();
      const users = Meteor.users.find().fetch();
      this.setState({ pages, users });
    })
  }

  render() {
    return(
      <div className="header">
        <h1 className="header__title">{this.props.title}</h1>
        <MenuItem name="Administrativo"
          pagesDatabase={this.state.pages}
          usersDatabase={this.state.users}
          allowedPages={this.administrative}/>
        {/* <MenuItem name="Cadastro" pages={this.state.pages}/>
        <MenuItem name="Contratos" pages={this.state.pages}/> */}
        <button className="button button--link-text header__logout" onClick={() => Accounts.logout()}>Sair</button>
      </div>
    )
  }
}
//
// AppHeader.propTypes = {
//   title: React.PropTypes.string.isRequired
// };