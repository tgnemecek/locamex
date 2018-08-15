import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Containers } from '/imports/api/containers';
import { Services } from '/imports/api/services';
import { Modules } from '/imports/api/modules';

import customTypes from '/imports/startup/custom-types';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import CustomInput from '/imports/components/CustomInput/index';

import DatabaseSide from './DatabaseSide/index';
import AddedItemsSide from './AddedItemsSide/index';
import ModularScreen from './ModularScreen/index';

export default class ProductSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      pub: '',
      dbName: '',
      addedItems: this.props.addedItems ? customTypes.deepCopy(this.props.addedItems) : [],
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
        this.state.pub = 'containersPub';
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
      this.setState({
        fullDatabase,
        filteredDatabase: fullDatabase,
        moduleDatabase
      });
    })
  }

  modifyModuleQuantity = (_id, quantity) => {
    var moduleDatabase = this.state.moduleDatabase;
    for (var i = 0; i < moduleDatabase.length; i++) {
      if (moduleDatabase[i]._id == _id) {
        moduleDatabase[i].quantity += quantity;
      }
    }
  }

  addItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = this.state.addedItems;

    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id == _id) {
        filteredDatabase[i].added = true;
        filteredDatabase[i].quantity = 1;
        addedItems.push(filteredDatabase[i]);
      }
    }
    this.setState({ addedItems, filteredDatabase });
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
            // addedItems[i].allowedModules[j].
          }
        }
      }
      this.setState({ modularScreenOpen, moduleObj });
    }
  }

  removeItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = this.state.addedItems;

    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == _id) {
        addedItems.splice(i, 1);
      }
    }
    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id == _id) {
        filteredDatabase[i].added = false;
      }
    }
    this.setState({ addedItems, filteredDatabase });
  }

  changePrice = (e) => {
    var addedItems = this.state.addedItems;
    addedItems[e.target.name].price = e.target.value;
    this.setState({ addedItems });
  }

  changeQuantity = (e) => {
    var addedItems = this.state.addedItems;
    addedItems[e.target.name].quantity = e.target.value;
    this.setState({ addedItems });
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
    this.props.saveEdits(newArray);
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
        <Box
          title={this.title}
          closeBox={this.props.closeProductSelection}
          width="1000px">
            <div className="product-selection">
              <DatabaseSide
                database={this.state.filteredDatabase}
                addItem={this.addItem}
                fullDatabase={this.state.fullDatabase}
                searchReturn={this.searchReturn}
                toggleModularScreen={this.toggleModularScreen}/>
              <AddedItemsSide
                database={this.props.database}
                changePrice={this.changePrice}
                changeQuantity={this.changeQuantity}
                addedItems={this.state.addedItems}
                removeItem={this.removeItem}
                />
              {this.state.modularScreenOpen ? <ModularScreen
                                                closeModularScreen={this.toggleModularScreen}
                                                moduleDatabase={this.state.moduleDatabase}
                                                container={this.state.moduleObj}
                                                saveEdits={this.addModular}
                                                /> : null}
            </div>
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: () => this.props.closeProductSelection()},
              {text: "Salvar", onClick: () => this.saveEdits()}
            ]}/>
        </Box>
      )
  }
}