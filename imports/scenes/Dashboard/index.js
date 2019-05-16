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
            <h2>Olá {this.props.user.firstName}.</h2>
            <h2>Avisos:</h2>
            <ul>
              <li>Contratos para Pessoa Física e Eventos agora disponíveis.</li>
            </ul>
          </div>
        </div>
      )
    } else return null
  }
}
