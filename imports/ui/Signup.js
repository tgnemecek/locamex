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
    let userProfile = {
      userName: this.refs.userName.value.trim(),
      userLastname: this.refs.userLastname.value.trim(),
      userType: this.refs.userType.value.trim()
    }

    if (password.length < 9) {
      return this.setState({error: 'Password must be more than 8 characters long.'})
    }

    Accounts.createUser({email, password, userProfile}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        this.setState({error: ''});
      }
    });
  }

  listTypes() {
    let userTypes = UserTypes.find().fetch();
    return userTypes.map(userType => {
      return (
        <option key={userType.type} value={userType.type}>{userType.label}</option>
      )
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
            <input type="text" ref="userLastname" name="userLastname" placeholder="Sobrenome"/>
            <select name="userType" ref="userType">
              {this.listTypes()}
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