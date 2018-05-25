import React from 'react';
import ReactModal from 'react-modal';

import { Services } from '../api/services';

export default class AddService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      lineCount: 1,
      _id: '',
      price: '',
      database: []
    }
  };

  componentDidMount() {
    this.servicesTracker = Tracker.autorun(() => {
      Meteor.subscribe('servicesPub');
      const database = Services.find({ visible: true }).fetch();
      this.setState({ database });
    })
  };

  renderLines() {
    var lineBlock = [];
    for (var i = 1; i <= this.state.lineCount; i++) {
      lineBlock[i] = this.listServices(i);
    };
    return lineBlock.map((line) => {
      return line;
    });
  };

  addLine() {
    this.setState({lineCount: this.state.lineCount + 1});
  };

  removeLine() {
    this.setState({lineCount: this.state.lineCount - 1});
  };

  showRemoveButton() {
    if (this.state.lineCount < 2) {
      return undefined;
    } else {
      return <button className="button--pill" onClick={this.removeLine.bind(this)}>-</button>
    };
  };

  onSubmit(e) {
    e.preventDefault();
  };

  handleModalClose() {
    this.setState({
      isOpen: false,
      lineCount: 1
    })
  }

  updateValue() {
    return 10;
  }

  handleChange(e) {
    let newPrice = '';
    let inputNumber = this.refs.inputNumber;

    this.state.price ? newPrice = this.state.price : newPrice = 0;
    newPrice = parseFloat(Math.round(newPrice * 100) / 100).toFixed(2);

    this.setState({
      _id: e.target.key,
      price: e.target.value
    });

    inputNumber.value = newPrice;

  };

  listServices (key) {
    return (
      <div className="add-services__line-div" key={key}>
        <select
          className="add-services__select"
          onChange={this.handleChange.bind(this)}
          onClick={this.handleChange.bind(this)}
          >
          <option key="default" hidden value="">Escolha um Serviço</option>
          {this.state.database.map((service) => {return <option key={service._id} value={service.price}>{service.description}</option>})}
        </select>
        <div className="add-services__right-side">
          {this.state.price ?
            <label className="add-services__label">Preço Base: R$ {this.state.price},00</label> :
            <label className="add-services__label">-</label>}
          <input type="number" className="add-services__input--small" ref="inputQuantity" placeholder="Qtd."/>
          <input type="number" className="add-services__input--medium" ref="inputNumber" value={this.updateValue.bind(this)} placeholder="R$"/>
        </div>
      </div>
    );
  };

  render() {
     return (
       <ReactModal
         isOpen={this.state.isOpen}
         className="boxed-view"
         contentLabel="Adicionar Serviço ao Contrato"
         appElement={document.body}
         onRequestClose={this.handleModalClose.bind(this)}
         className="boxed-view__box"
         overlayClassName="boxed-view boxed-view--modal"
         >
         <h1>Adicionar Serviço ao Contrato</h1>
         <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
           <div>
             {this.renderLines()}
           </div>
           <div className="button__main-div">
             <button className="button--pill" onClick={this.addLine.bind(this)}>+</button>
             {this.showRemoveButton()}
           </div>
           <div className="button__main-div">
             <button className="button button--secondary add-services__button" onClick={this.handleModalClose.bind(this)}>Fechar</button>
             <button className="button add-services__button">Adicionar</button>
           </div>
         </form>
       </ReactModal>
     );
  };
}





