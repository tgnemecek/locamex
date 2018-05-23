import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import PrivateHeader from './PrivateHeader';
import { Services } from '../api/services';
import ConfirmationMessage from './ConfirmationMessage';

export default class ListServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      database: []
    }
  };

  componentDidMount() {
    this.servicesTracker = Tracker.autorun(() => {
      Meteor.subscribe('servicesPub');
      const database = Services.find().fetch();
      this.setState({ database });
    })
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Lista de Serviços"/>
        <div className="page-content">
          {/* <button onClick={this.openEditWindow}>Criar Novo</button>
          {this.editServiceScreen(this.state.editOpen, this.props.description, this.props.price)} */}
          <table className="list-view__table">
            <tbody className="list-view__tbody">
              <tr>
                <th className="list-view__left-align list-view__small">Código</th>
                <th className="list-view__left-align">Descrição</th>
                <th className="list-view__right-align list-view__medium">Preço Base</th>
              </tr>
              {this.state.database.map((services) => {
                return <ServiceItem
                  key={services._id}
                  _id={services._id}
                  code={services.code}
                  description={services.description}
                  price={services.price}
                />
            })}
            </tbody>
          </table>
        </div>
      </div>
      )
  }
}

class ServiceItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      confirmationWindow: false
    }
    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.openConfirmationWindow = this.openConfirmationWindow.bind(this);
    this.closeConfirmationWindow = this.closeConfirmationWindow.bind(this);
    this.closeWithRemoval = this.closeWithRemoval.bind(this);
  };

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
    Meteor.call('services.remove', this.props._id);
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

  editServiceScreen(open, description, price) {
    if (open) {
      price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
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
            <h2>Editar Serviço</h2>
            <div className="edit-services__main-div">
              <label>Descrição:</label><input type="text" defaultValue={description}/>
              <label>Preço Base:</label><input type="number" defaultValue={price}/>
            <button className="button button--danger edit-services--remove" onClick={this.openConfirmationWindow}>Remover</button>
            </div>
            <div className="button__main-div">
              <button className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
              <button className="button">Salvar</button>
            </div>
            {this.state.confirmationWindow ? <ConfirmationMessage
              title="Deseja excluir este serviço?"
              unmountMe={this.closeConfirmationWindow}
              confirmMe={this.closeWithRemoval}/> : null}
        </ReactModal>
      )
    }
  }

  render() {
    return (
        <tr>
          <td className="list-view__left-align">{this.props.code}</td>
          <td className="list-view__left-align">{this.props.description}</td>
          <td className="list-view__right-align">R$ {this.props.price},00</td>
          <td className="list-view__right-align list-view__edit"><button onClick={this.openEditWindow}>Editar</button></td>
          {this.editServiceScreen(this.state.editOpen, this.props.description, this.props.price)}
        </tr>
    )
  }
}