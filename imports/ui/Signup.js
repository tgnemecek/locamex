import React from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

import { UserTypes } from '../api/user-types';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }
  onSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    if (password.length < 9) {
      return this.setState({error: 'Password must be more than 8 characters long.'})
    }

    Accounts.createUser({email, password}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        this.setState({error: ''});
      }
    });
  }
  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Criar novo usuário</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
            <input type="text" ref="userName" name="userName" placeholder="Nome"/>
            <select name="userType">
              <option value="adm">Administrador</option>
              <option value="guest">Visitante</option>
            </select>
            <input type="email" ref="email" name="email" placeholder="Email"/>
            <input type="password" ref="password" name="password" placeholder="Senha"/>
            <button className="button">Criar Usuário</button>
          </form>
          <Link to="/">Voltar</Link>
        </div>
      </div>
    );
  }
}