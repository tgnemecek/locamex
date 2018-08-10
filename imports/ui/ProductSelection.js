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
      moduleDatabase: [],
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
      Meteor.subscribe('modulesPub');
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
      var moduleDatabase = Modules.find().fetch();
      this.setState({ fullDatabase, filteredDatabase: fullDatabase, moduleDatabase });
    })
  }

  renderDatabase = () => {
    return this.state.filteredDatabase.map((item, i, array) => {
      item.dbIndex = i;
      return (
        <tr key={i} className="product-selection__db-item">
          <td>{item._id}</td>
          <td>{item.description}</td>
          {this.props.database != 'accessories' ? null : <td>{item.available}/{item.total}</td>}
          <td><button value={i} onClick={item.type !== 'modular' ? this.addItem : this.toggleModularScreen}>►</button></td>
        </tr>
      )
    })
  }

  addItem = (e) => {
    var addedItems = this.state.addedItems;
    var value = e.target.value;
    addedItems.push(this.state.fullDatabase[value]);
    this.setState({ addedItems });
  }

  toggleModularScreen = (e) => {
    var modularScreenOpen = !this.state.modularScreenOpen;
    var index = e.target.value;
    var addedItems = this.state.addedItems;
    if (this.state.modularScreenOpen) {
      this.setState({ modularScreenOpen, moduleObj: '' })
    } else {
      var moduleObj = this.state.fullDatabase[index];
      for (var i = 0; i < addedItems.length; i++) {
        if (addedItems[i].type == 'modular') {
          for (var j = 0; j < addedItems[i].allowedModules.length; j++) {
            if (this.state.moduleDatabase) {}
            // addedItems[i].allowedModules[j]. //FINISH THIS. THE PROBLEM IS THAT THE AVAILABLE # OF MODULES HAVE TO UPDATE AFTER EACH ADD/EDIT
          }
        }
      }
      this.setState({ modularScreenOpen, moduleObj });
    }
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
          <td>{item.type !== 'modular' ? <CustomInput
                                            type="number"
                                            name={i}
                                            value={item.quantity ? item.quantity : 1}
                                            max={item.available}
                                            onChange={this.changeQuantity}/>
                                       : <button value={item.dbIndex} onClick={this.toggleModularScreen}>✎</button>}
          </td>
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
      if (item.quantity > 0 || item.type == 'modular') newArray.push(item); // REMOVE MODULAR REQUIREMENT, IN THE MOD.SCREEN, INSERT QUANTITY INPUT
    })
    this.props.saveEdits(newArray, this.props.database);
    this.props.closeProductSelection();
  }

  addModular = (container, modulesArray) => {
    var addedItems = this.state.addedItems;
    var obj = {target: {value: ''}};
    var alreadyIncluded = false;
    var moduleDatabase = this.state.moduleDatabase;
    container.allowedModules.forEach((module, i) => {
      module.selected = modulesArray[i].selected;
      module.description = modulesArray[i].description;
    });
    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == container._id) {
        addedItems.splice(i, 1, container);
        alreadyIncluded = true;
        break;
      }
    }
      // if (addedItems[i]._id == container._id) {
      //   addedItems.splice(i, 1, container);
      //   alreadyIncluded = true;
      //   break;
      // }
    if (!alreadyIncluded) addedItems.push(container);
    this.setState({ addedItems });
    this.toggleModularScreen(obj);
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
                {this.state.modularScreenOpen ? <ModularScreen
                                                  closeModularScreen={this.toggleModularScreen}
                                                  moduleDatabase={this.state.moduleDatabase}
                                                  container={this.state.moduleObj}
                                                  saveEdits={this.addModular}
                                                  /> : null}
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
      database: [],
      quantity: 1
    }
  }

  componentDidMount() {
    var preDatabase = this.props.moduleDatabase;
    var database = [];
    this.props.container.allowedModules.forEach((module, i) => {
      for (var j = 0; j < preDatabase.length; j++) {
        if (preDatabase[j]._id == module._id) {
          preDatabase[j].selected = module.selected;
          database.push(preDatabase[j]);
          break;
        }
      }
    })
    this.setState({ database });
  }

  changeQuantity = (name, quantity) => {
    this.setState({ quantity });
  }

  calculateMax = () => {
    var database = JSON.parse(JSON.stringify(this.state.database));
    var minorDivisible = 999;
    var division;
    for (var i = 0; i < database.length; i++) {
      if (!database[i].selected) continue;
      division = Number(database[i].available) / Number(database[i].selected);
      if (division < minorDivisible) minorDivisible = division;
    }
    return Math.floor(minorDivisible);
  }

  onChange = (name, value) => {
    this.state.database[name].selected = value;
    var quantity = 1;
    this.setState({ quantity });
    this.forceUpdate();
  }

  addModular = () => {
    var exportArray = [];
    var container = this.props.container;
    this.state.database.forEach((item) => {
      if (item.selected != 0 && item.selected != undefined) {
        exportArray.push(item);
      }
    })
    this.props.saveEdits(container, exportArray);
  }

  renderBody = () => {
    return this.state.database.map((module, i) => {
      function aaa() { return 1 };
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><CustomInput type="number" max={module.available} name={i} value={module.selected} onChange={this.onChange}/></td>
          <td>{module.available}</td>
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
            <div>
              <label>Quantidade:</label>
              <CustomInput type="number" max={this.calculateMax()} value={this.state.quantity} onChange={this.changeQuantity}/>
            </div>
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
            <button type="button" className="button button--secondary" onClick={this.props.closeModularScreen}>Cancelar</button>
            <button type="button" className="button button--primary" onClick={this.addModular}>Salvar</button>
          </div>
        </div>
      </div>
    )
  }
}