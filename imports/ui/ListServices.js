import ReactModal from 'react-modal';
import React, { Fragment } from 'react'

import PrivateHeader from './PrivateHeader';
import { Services } from '../api/services';
import ConfirmationMessage from './ConfirmationMessage';

var serviceDatabase = Services.find().fetch();

export default class ListServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      database: serviceDatabase
    }
  };
  render() {
    return (
      <div>
        <PrivateHeader title="Lista de Serviços"/>
        <div className="page-content">
          {this.state.editOpen ? <EditService/> : undefined}
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
      removeConfirmation: false
    }
  };

  openEditWindow() {
    this.setState({editOpen: true});
  };

  editServiceScreen(open, description, price) {
    if (open) {
      price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
      return(
        <Fragment>
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
              <button className="button button--danger edit-services--remove" onClick={() => this.setState({removeConfirmation: true})}>Remover</button>
              </div>
              <div className="button__main-div">
                <button className="button button--secondary" onClick={() => this.setState({editOpen: false})}>Fechar</button>
                <button className="button">Salvar</button>
              </div>
          </ReactModal>
          <div>
            {this.state.removeConfirmation ? <ConfirmationMessage title="Deseja excluir este serviço?"/> : undefined}
          </div>
        </Fragment>
      )
    }
  }

  // confirmRemovalScreen(open) {
  //
  //   if (open) {
  //     return(
  //       <ReactModal
  //         isOpen={true}
  //         className="boxed-view"
  //         contentLabel="Mensagem de Confirmação"
  //         appElement={document.body}
  //         onRequestClose={() => this.setState({editOpen: false})}
  //         className="boxed-view__box"
  //         overlayClassName="boxed-view boxed-view--modal"
  //         >
  //           <h3>Deseja excluir o serviço?</h3>
  //           <div className="button__main-div">
  //             <button className="button button--secondary" onClick={() => this.setState({editOpen: false})}>Não</button>
  //             <button className="button button--danger">Sim</button>
  //           </div>
  //           {this.editServiceScreen(this.state.editOpen)}
  //       </ReactModal>
  //     )
  //   }
  // }

  render() {
    return (
        <tr>
          <td className="list-view__left-align">{this.props.code}</td>
          <td className="list-view__left-align">{this.props.description}</td>
          <td className="list-view__right-align">R$ {this.props.price},00</td>
          <td className="list-view__right-align list-view__edit"><button onClick={this.openEditWindow.bind(this)}>Editar</button></td>
          {this.editServiceScreen(this.state.editOpen, this.props.description, this.props.price)}
        </tr>
    )
  }
}