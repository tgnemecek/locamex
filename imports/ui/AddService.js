import React from 'react';
import ReactModal from 'react-modal';

import { Services } from '../api/services';

var servicesArray = Services.find().fetch();

export default class AddService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      lineCount: 1
    }
  };

  renderLines() {
    var lineBlock = [];
    for (var i = 1; i <= this.state.lineCount; i++) {
      lineBlock[i] = <ListServices key={i}/>
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

  render() {
     return (
       <ReactModal
         isOpen={this.state.isOpen}
         className="boxed-view"
         contentLabel="Adicionar Serviço ao Contrato"
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

class ListServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      code: '',
      description: '',
      price: ''
    };
  }

  handleChange(e) {
    console.log('array', servicesArray);
    var newPrice = '';
    this.state.price ? newPrice = this.state.price : newPrice = 0;
    newPrice = parseFloat(Math.round(newPrice * 100) / 100).toFixed(2);
    this.refs.numberInput.value = newPrice;

    this.setState({
      _id: e.target.key,
      code: '',
      description: '',
      price: e.target.value
    });
  };

  render() {
    return (
      <div className="add-services__line-div">
        <select
          name="services"
          className="add-services__select"
          onChange={this.handleChange.bind(this)}
          onClick={this.handleChange.bind(this)}
          >
          <option key="default" hidden value="">Escolha um Serviço</option>
          {servicesArray.map((services) => {return <option key={services._id} value={services.price}>{services.description}</option>})}
        </select>
        {this.state.price ?
          <label className="add-services__label">Preço Base: R$ {this.state.price},00</label> :
          <label className="add-services__label">-</label>}
        <input type="number" className="add-services__input" ref="quantityInput" placeholder="Qtd."/>
        <input type="number" className="add-services__input" ref="numberInput" placeholder="R$"/>
      </div>
    );
  }
}





