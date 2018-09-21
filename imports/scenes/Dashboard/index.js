import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Users } from '/imports/api/users/index';

export default class Dashboard extends React.Component {
  render() {
    if (this.props.user) {
      return (
        <div className="page-content">
          <div className="dashboard">
            <h1>Página Inicial</h1>
            <h2>Você está logado como {this.props.user.username}.</h2>
            <h2>Aviso:</h2>
            <p>Com a criação da página nova "Manutenção", os usuários que forem acessá-la precisam de permissão de acesso.</p>
          </div>
        </div>
      )
    } else return null
  }
}
