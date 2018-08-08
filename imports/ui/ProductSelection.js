import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactModal from 'react-modal';

import customTypes from '../startup/custom-types';
import SearchBar from './SearchBar';
import CustomInput from './CustomInput';

import { Containers } from '../api/containers';
import { Services } from '../api/services';
import { Modules } from '../api/modules';

export default class ProductSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      pub: '',
      dbName: '',
      addedItems: this.props.addedItems ? JSON.parse(JSON.stringify(this.props.addedItems)) : [],
      modularScreenOpen: false,
      moduleObj: ''
    }
    switch (this.props.database) {
      case 'services':
        this.title = "Seleção de Serviços";
        this.state.pub = 'servicesPub';
        this.state.dbName = Services;
        break;
      case 'containers':
        this.title = "Seleção de Containers";
        this.state.pub = 'containersPub', 'containersModularPub';
        this.state.dbName = Containers;
        break;
    }
  }

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe(this.state.pub);
      var fullDatabase = this.state.dbName.find().fetch();
      fullDatabase.forEach((item, i) => {
        switch (item.status) {
          case 'inactive':
          case 'maintenance':
          case 'rented':
            fullDatabase.splice(i, 1);
            break;
        }
      })
      this.setState({ fullDatabase, filteredDatabase: fullDatabase });
    })
  }

  renderDatabase = () => {
    return this.state.filteredDatabase.map((item, i, array) => {
      return (
        <tr key={i} className="product-selection__db-item">
          <td>{item._id}</td>
          <td>{item.description}</td>
          {this.props.database != 'accessories' ? null : <td>{item.available}/{item.total}</td>}
          <td><button value={i} onClick={this.addItem}>►</button></td>
        </tr>
      )
    })
  }

  addItem = (e) => {
    var addedItems = this.state.addedItems;
    var value = e.target.value;
    if (this.state.fullDatabase[value].type == 'modular') {
      this.setState({ modularScreenOpen: true, moduleObj: this.state.fullDatabase[value] });
    } else {
      for (var i = 0; i < addedItems.length; i++) {
        if (addedItems[i]._id == this.state.fullDatabase[value]._id) return;
      }
    }
    addedItems.push(this.state.fullDatabase[value]);
    this.setState({ addedItems });
  }

  removeItem = (e) => {
    var addedItems = this.state.addedItems;
    addedItems.splice(this.state.fullDatabase[e.target.value], 1);
    this.setState({ addedItems });
  }

  changePrice = (name, value) => {
    var addedItems = this.state.addedItems;
    addedItems[name].price = value;
    this.setState({ addedItems });
  }

  changeQuantity = (name, value) => {
    var addedItems = this.state.addedItems;
    addedItems[name].quantity = value;
    this.setState({ addedItems });
  }

  renderAddedItems = () => {
    return this.state.addedItems.map((item, i, array) => {
      return (
        <tr key={i} className="product-selection__db-item">
          <td>{item._id}</td>
          <td>{item.description}</td>
          <td><CustomInput type="currency" name={i} value={item.price * 100} onChange={this.changePrice}/></td>
          <td><CustomInput type="number" name={i} value={item.quantity ? item.quantity : 1} max={item.available} onChange={this.changeQuantity}/></td>
          <td><button value={i} onClick={this.removeItem}>✖</button></td>
        </tr>
      )
    })
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
  }

  saveEdits = () => {
    var addedItems = this.state.addedItems;
    var newArray = [];
    addedItems.forEach((item) => {
      if (item.quantity > 0) newArray.push(item);
    })
    this.props.saveEdits(newArray, this.props.database);
    this.props.closeProductSelection();
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Emitir Documentos"
          appElement={document.body}
          onRequestClose={this.props.closeProductSelection}
          className="product-selection"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeProductSelection} className="button--close-box">✖</button>
              <div className="product-selection__header">
                <h3>{this.title}</h3>
              </div>
              <div className="product-selection__body">
                {this.state.modularScreenOpen ? <ModularScreen container={this.state.moduleObj}/> : null}
                <div className="product-selection__database">
                  <SearchBar
                    database={this.state.fullDatabase}
                    options={this.searchOptions}
                    searchReturn={this.searchReturn}/>
                  <table className="table table--product-selection--database">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        {this.props.database != 'accessories' ? null : <th>Disp.</th>}
                        <th style={{visibility: "hidden"}}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderDatabase()}
                    </tbody>
                  </table>
                </div>
                <div className="product-selection__contract">
                  <label>Itens Adicionados no Contrato:</label>
                  <table className="table table--product-selection--contract">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Qtd.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderAddedItems()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="product-selection__footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>Salvar</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}

class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: []
    }
  }

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('modulesPub');
      var preDatabase = Modules.find().fetch();
      var database = [];
      preDatabase.forEach((item) => {
        if (this.props.container.allowedModules.includes(item._id)) {
          database.push(item);
        }
      })
      this.setState({ database });
    })
  }

  renderBody = () => {
    return this.state.database.map((module, i) => {
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><CustomInput type="number" max={module.quantity}/></td>
          <td>{module.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <div className="boxed-view boxed-view--modal">
        <div className="boxed-view__box">
          <h3>Montagem de Container Modular:</h3>
          <div>
            <table className="table table--modular-screen">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Componentes</th>
                  <th>Qtd.</th>
                  <th>Disp.</th>
                </tr>
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
          <div className="product-selection__footer">
            <button type="button" className="button button--secondary" onClick={this.saveEdits}>Voltar</button>
            <button type="button" className="button button--primary" onClick={this.saveEdits}>Adicionar</button>
          </div>
        </div>
      </div>
    )
  }
}