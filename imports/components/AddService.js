import React from 'react';
import ReactModal from 'react-modal';
import "babel-polyfill";

import { Services } from '../api/services';
import customTypes from '/imports/startup/custom-types';

export default class AddService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      lineCount: 1,
      _id: '',
      price: '',
      removedLines: [],
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

  existsInArray(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == value) return true
    }
  }

  renderLines() {
    var lineBlock = [];
    var removedLines = this.state.removedLines;

    for (var i = 1; i <= this.state.lineCount; i++) {
      if (!removedLines.includes(i)) {
        lineBlock[i] = <LineService key={i} lineNumber={i} database={this.state.database} removeLine={this.removeLine.bind(this)}/>
      }
    };
    return lineBlock.map((line) => {
      return line;
    });
  };

  addLine() {
    this.setState({lineCount: this.state.lineCount + 1});
  };

  removeLine(lineNumber) {
    let removedLines = this.state.removedLines;
    this.setState({ removedLines: removedLines.push(lineNumber) });
  };

  onSubmit(e) {
    e.preventDefault();
    aaa();
  };

  handleModalClose() {
    this.setState({
      isOpen: false,
      lineCount: 1
    })
  }

  render() {
     return (
       <Box
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
           <div className="add-services__line-div-container">
             {this.renderLines()}
             <button className="button--pill button--fix" onClick={this.addLine.bind(this)}>+</button>
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

class LineService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      price: ''
    }
  };

  handleChange(e) {
    let newPrice = '';
    let inputNumber = this.refs.inputNumber;

    this.state.price ? newPrice = this.state.price : newPrice = 0;
    newPrice = customTypes.formatReais(newPrice, false);

    this.setState({
      _id: e.target.key,
      price: new Number (e.target.value)
    });

    inputNumber.value = newPrice;

  };

  render() {
    return (
      <div className="add-services__line-div">
        <div className="add-services__left-side">
          <button className="button--pill" onClick={() => this.props.removeLine(this.props.lineNumber)}>x</button>
          <select
            className="add-services__select"
            onChange={this.handleChange.bind(this)}
            onClick={this.handleChange.bind(this)}
            >
            <option key="default" hidden value="">Escolha um Serviço</option>
            {this.props.database.map((service) => {return <option key={service._id} value={service.price}>{service.description}</option>})}
          </select>
        </div>
        <div className="add-services__right-side">
          {this.state.price ?
            <label className="add-services__label">Preço Base: {customTypes.formatReais(this.state.price, true)}</label> :
            <label className="add-services__label">-</label>}
          <input type="number" className="add-services__input--small" ref="inputQuantity" placeholder="Qtd."/>
          <input type="number" className="add-services__input--medium" ref="inputNumber" placeholder="R$"/>
        </div>
      </div>
      )
    }
};

