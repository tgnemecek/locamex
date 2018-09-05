import React from 'react';
import { withRouter } from 'react-router'
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import { Pages } from '/imports/api/pages/index';
import MenuItem from './MenuItem/index'

class AppHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      pagesDatabase: [],
      usersDatabase: []
    }
    this.administrative = ["0000", "0001"];
    this.clients = ["0002"];
    this.modules = ["0003"];
    this.products = ["0004", "0005", "0006"];
    this.contracts = ["0007"];
  };

  componentDidMount() {
    this.updateLocation();
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('pagesPub');
      Meteor.subscribe('usersPub');
      const pagesDatabase = Pages.find().fetch();
      const usersDatabase = Meteor.users.find().fetch();
      this.setState({ pagesDatabase, usersDatabase });
    })
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) this.updateLocation();
  }

  updateLocation = () => {
    var pathname = this.props.location.pathname;
    if (pathname.includes('contracts')) {
      this.setState({ title: "Contratos" });
      return;
    } else if (pathname.includes('contract')) {
      this.setState({ title: "Contrato" });
      return;
    } else if (pathname.includes('containers')) {
      this.setState({ title: "Containers" });
      return;
    } else if (pathname.includes('users')) {
      this.setState({ title: "Usuários" });
      return;
    } else if (pathname.includes('services')) {
      this.setState({ title: "Serviços" });
      return;
    } else if (pathname.includes('accessories')) {
      this.setState({ title: "Acessórios" });
      return;
    } else if (pathname.includes('clients')) {
      this.setState({ title: "Clientes" });
      return;
    } else if (pathname.includes('modules')) {
      this.setState({ title: "Componentes" });
      return;
    }
    throw new Error("Couldn't set title at AppHeader component");
  }

  render() {
    return(
      <div className="header__background">
        <div className="header">
          <h1 className="header__title">{this.state.title}</h1>
          {this.state.pagesDatabase.length > 0 ?
            <>
            <MenuItem
              name="Administrativo"
              pagesDatabase={this.state.pagesDatabase}
              usersDatabase={this.state.usersDatabase}
              allowedPages={this.administrative}/>
            <MenuItem
              name="Clientes"
              pagesDatabase={this.state.pagesDatabase}
              usersDatabase={this.state.usersDatabase}
              allowedPages={this.clients}/>
            <MenuItem
              name="Componentes"
              pagesDatabase={this.state.pagesDatabase}
              usersDatabase={this.state.usersDatabase}
              allowedPages={this.modules}/>
            <MenuItem
              name="Produtos"
              pagesDatabase={this.state.pagesDatabase}
              usersDatabase={this.state.usersDatabase}
              allowedPages={this.products}/>
            <MenuItem
              name="Contratos"
              pagesDatabase={this.state.pagesDatabase}
              usersDatabase={this.state.usersDatabase}
              allowedPages={this.contracts}/>
            </>
          : null}
          <button className="header__logout" onClick={() => Accounts.logout()}>Sair</button>
        </div>
      </div>
    )
  }
}
export default withRouter(AppHeader);
//
// AppHeader.propTypes = {
//   title: React.PropTypes.string.isRequired
// };