import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';
import PrivateHeader from './PrivateHeader';
import { Services } from '../api/services';
import { UserTypes } from '../api/user-types';
import ConfirmationMessage from './ConfirmationMessage';

export default class ListUsers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      database: []
    }
  };

  componentDidMount() {
    this.servicesTracker = Tracker.autorun(() => {
      Meteor.subscribe('usersPub');
      const database = Meteor.users.find({ visible: true }).fetch();
      this.setState({ database });
    })
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Lista de Usuários"/>
        <div className="page-content">
          <table className="list-view__table">
            <tbody className="list-view__tbody">
              <tr>
                <th className="list-view__left-align list-view__small">Código</th>
                <th className="list-view__left-align">Nome</th>
                <th className="list-view__right-align list-view__medium">Tipo</th>
                <th className="list-view__right-align list-view__small"><UserItem key={0} createNew={true}/></th>
              </tr>
              {this.state.database.map((user) => {
                return <UserItem
                  key={user._id}
                  _id={user._id}
                  userName={user.userName}
                  userEmail={user.emails[0].address}
                  userTypeId={user.userTypeId}
                />
            })}
            </tbody>
          </table>
        </div>
      </div>
      )
  }
}

class UserItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      confirmationWindow: false,
      formError: '',
      userName: this.props.userName,
      userType: '',
      userTypeId: this.props.userTypeId,
      typesDatabase: []
    }
    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.openConfirmationWindow = this.openConfirmationWindow.bind(this);
    this.closeConfirmationWindow = this.closeConfirmationWindow.bind(this);
    this.closeWithRemoval = this.closeWithRemoval.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
  };

  componentDidMount() {
    this.servicesTracker = Tracker.autorun(() => {
      Meteor.subscribe('userTypesPub');
      const typesDatabase = UserTypes.find({ visible: true }).fetch();
      this.setState({ typesDatabase });
      const userType = typesDatabase.find((item) => item._id === this.state.userTypeId);
      userType ? this.setState({ userType: userType.label }) : null;
    })
  }

  openEditWindow() {
    this.setState({editOpen: true});
  };

  closeEditWindow() {
    this.setState({
      editOpen: false,
      confirmationWindow: false
    });
  };

  closeWithRemoval() {
    Meteor.call('services.hide', this.props._id);
    this.setState({
      editOpen: false,
      confirmationWindow: false
    });
  };

  openConfirmationWindow() {
    this.setState({confirmationWindow: true});
  };

  closeConfirmationWindow() {
    this.setState({confirmationWindow: false});
  }

  removeSpecialCharacters(e) {
    let value = e.target.value;
    value = value.replace(/-./g, '');
  }

  saveEdits(e) {
    e.preventDefault();

    let newUserName = this.refs.userName.value.trim();
    let newUserTypeId = this.refs.userType.value.trim();
    let newEmail = this.refs.email.value.trim();
    let newPassword = this.refs.password.value.trim();

    if (!newUserName || !newEmail) {
      this.setState({formError: 'Favor preencher todos os campos'})
      throw new Meteor.Error('required-fields-empty');
    };
    if (newPassword && newPassword.length < 6) {
      this.setState({formError: 'A senha deve ter 6 ou mais caracteres'})
      throw new Meteor.Error('password-too-long');
    }

    Meteor.call('users.update', this.props._id, newUserName, newUserTypeId, newEmail, newPassword);

    // Meteor.call('users.update', this.props._id, newUserName, newUserType, newEmail, newPassword, (err, res) => {
    //   err ? throw new Meteor.Error('method-call-failed') : null;
    // });


    // if (!Meteor.call('users.update', this.props._id, newUserName, newUserType, newEmail, newPassword)) {
    //   throw new Meteor.Error('method-call-failed');
    // }

    const userTypeLabel = this.state.typesDatabase.find((item) => item._id === newUserTypeId);
    this.setState({ userType: userTypeLabel.label });
    this.setState({ userTypeId: userTypeLabel._id });
    this.setState({ userName: newUserName });
    this.setState({ userTypeId: newUserTypeId });

    this.closeEditWindow();
  }

  createNewUser(e) {
    e.preventDefault();

    let userName = this.refs.userName.value.trim();
    let userTypeId = this.refs.userType.value.trim();
    let userEmail = this.refs.email.value.trim();
    let userPassword = this.refs.password.value.trim();

    if (!userName || !userEmail) {
      this.setState({formError: 'Favor preencher todos os campos'})
      throw new Meteor.Error('required-fields-empty');
    }
    if (userName.length > 40) {
      this.setState({formError: 'Limite de 40 caracteres excedido'})
      throw new Meteor.Error('string-too-long');
    }
    Meteor.call('users.insert', userName, userTypeId);
    this.closeEditWindow();
  }

  editServiceScreen(open, _id, userName, userTypeId, userEmail, createNew) {
    if (open) {
      return(
        <ReactModal
          isOpen={true}
          className="boxed-view"
          contentLabel="Editar Serviço"
          appElement={document.body}
          onRequestClose={() => this.setState({editOpen: false})}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
          >
            {createNew ? <h2>Criar Novo Usuário</h2> : <h2>Editar Usuário</h2>}
            {this.state.formError}
            <form onSubmit={createNew ? this.createNewUser.bind(this) : this.saveEdits.bind(this)}>
              <div className="edit-services__main-div">
                <label className="edit-users__left-labels">Nome Completo:</label>
                <input type="text" ref="userName" defaultValue={this.state.userName} className="edit-users__full-input"/>
                <label className="edit-users__left-labels">Email:</label>
                <input type="email" ref="email" defaultValue={userEmail} className="edit-users__email"/>
                <label>Tipo de Usuário:</label>
                <select key={userTypeId} ref="userType" defaultValue={userTypeId}>
                  {this.state.typesDatabase.map((type) => {return <option key={type._id} value={type._id}>{type.label}</option>})}
                </select>
                <label className="edit-users__left-labels">Redefinir Senha:</label>
                <input type="password" ref="password" className="edit-users__full-input"/>
                {createNew ? null : <button type="button" className="button button--danger edit-users--remove" onClick={this.openConfirmationWindow}>Remover</button>}
              </div>
              <div className="button__main-div">
                <button type="button" className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
                {createNew ? <button className="button">Criar</button> : <button className="button">Salvar</button>}
              </div>
            </form>
            {this.state.confirmationWindow ? <ConfirmationMessage
              title="Deseja excluir este usuário?"
              unmountMe={this.closeConfirmationWindow}
              confirmMe={this.closeWithRemoval}/> : null}
        </ReactModal>
      )
    }
  }

  render() {
    if(this.props.createNew) {
      return(
        <div>
          <button className="button--pill list-view__button" onClick={this.openEditWindow}>+</button>
          {this.editServiceScreen(this.state.editOpen, '', '', '', '', true)}
        </div>
      )
    } else {
      return (
          <tr>
            <td className="list-view__left-align">{this.props._id}</td>
            <td className="list-view__left-align">{this.state.userName}</td>
            <td className="list-view__right-align">{this.state.userType}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button></td>
            {this.editServiceScreen(this.state.editOpen, this.props._id, this.props.userName, this.state.userTypeId, this.props.userEmail)}
          </tr>
      )
    }
  }
}