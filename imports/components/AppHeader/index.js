import React from 'react';
import { withRouter } from 'react-router'
import { Accounts } from 'meteor/accounts-base';
import { Link, Redirect } from 'react-router-dom';
import { Pages } from '/imports/api/pages/index';
import MenuItem from './MenuItem/index'

class AppHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: undefined,
      pagesDatabase: [],
      ready: false
    }
    this.administrative = ["0000", "0001"];
    this.clients = ["0002"];
    this.products = ["0004", "0005", "0008", "0003"];
    this.contracts = ["0007"];
  };

  componentDidMount() {
    this.updateLocation();
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('pagesPub');
      Meteor.subscribe('usersPub');
      const pagesDatabase = Pages.find().fetch();
      const ready = pagesDatabase.length ? true : false;
      this.setState({ pagesDatabase, ready });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
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
    } else if (pathname.includes('packs')) {
      this.setState({ title: "Pacotes" });
      return;
    } else {
      this.setState({ title: undefined });
      return;
    }
  }

  logout = () => {
    Meteor.logout();
    window.location.reload();
  }

  render() {
    if (this.state.title) {
      return (
        <div className="header__background">
          <div className="header">
            <h1 className="header__title">{this.state.title}</h1>
            <div className="header__menu">
            {this.state.ready ?
                <>
                <MenuItem
                  name="Administrativo"
                  pagesDatabase={this.state.pagesDatabase}
                  pages={this.administrative}/>
                <MenuItem
                  name="Clientes"
                  pagesDatabase={this.state.pagesDatabase}
                  pages={this.clients}/>
                <MenuItem
                  name="Produtos"
                  pagesDatabase={this.state.pagesDatabase}
                  pages={this.products}/>
                <MenuItem
                  name="Contratos"
                  pagesDatabase={this.state.pagesDatabase}
                  pages={this.contracts}/>
                </>
            : null}
            <button className="header__logout" onClick={() => this.logout()}>Sair</button>
            </div>
          </div>
        </div>
      )
    } else return null;
  }
}
export default withRouter(AppHeader);