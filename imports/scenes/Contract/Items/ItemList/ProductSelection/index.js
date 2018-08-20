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
      modularScreenOpen: 0,
      modularContainer: ''
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
    this.Tracker = Tracker.autorun(() => {
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
    var index = e.target.value;
    var filteredDatabase = customTypes.deepCopy(this.state.filteredDatabase);
    var addedItems = customTypes.deepCopy(this.state.addedItems);
    filteredDatabase[index].added = true;
    filteredDatabase[index].quantity = 1;
    addedItems.push(filteredDatabase[index]);
    this.setState({ addedItems, filteredDatabase });
  }

  toggleModularScreen = (e) => {
    var modularScreenOpen = 0;
    var modularContainer = '';
    if (!e) {
      this.setState({ modularScreenOpen, modularContainer });
      return;
    }
    var index = e.target.value;
    var requestFrom = e.target.name;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = this.state.addedItems;
    if (this.state.modularScreenOpen == 0) {
      if (requestFrom == "database") {
        modularScreenOpen = 1;
        modularContainer = filteredDatabase[index];
      } else if (requestFrom == "addedItems") {
        modularScreenOpen = 2;
        modularContainer = addedItems[index];
      }
    }
    this.setState({ modularScreenOpen, modularContainer });
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
      if (item.quantity > 0 || item.type == 'modular') newArray.push(item);
    })
    this.props.saveEdits(newArray);
    this.props.closeProductSelection();
  }

  addModular = (pack) => {
    var addedItems = customTypes.deepCopy(this.state.addedItems);
    var moduleDatabase = customTypes.deepCopy(this.state.moduleDatabase);
    var usedModules = pack.modules;
    var modulesAddedCount = 0;
    var _id = '';
    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i].type == 'modular') {
        modulesAddedCount++;
      }
    }
    _id = "T" + (modulesAddedCount.toString().padStart(3, '0'));
    pack._id = _id;
    addedItems.push(pack);
    for (var i = 0; i < usedModules.length; i++) {
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == usedModules[i]._id) {
          moduleDatabase[j].available -= usedModules[i].selected;
          break;
        }
      }
    }
    this.setState({ addedItems, moduleDatabase });
    this.toggleModularScreen();
  }

  editModular = (pack) => {
    var addedItems = customTypes.deepCopy(this.state.addedItems);
    var moduleDatabase = customTypes.deepCopy(this.state.moduleDatabase);
    var oldModules;
    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == pack._id && addedItems[i].type == 'modular') {
        oldModules = customTypes.deepCopy(addedItems[i].modules);
        addedItems[i] = {...pack};
        break;
      }
    }
    var usedModules = pack.modules;
    for (var i = 0; i < usedModules.length; i++) {
      if (usedModules[i].selected == oldModules[i].selected) continue;
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == usedModules[i]._id) {
          moduleDatabase[j].available += oldModules[i].selected;
          moduleDatabase[j].available -= usedModules[i].selected;
          break;
        }
      }
    }
    this.setState({ addedItems, moduleDatabase });
    this.toggleModularScreen();
  }

  removeModular = (index) => {
    var addedItems = customTypes.deepCopy(this.state.addedItems);
    var moduleDatabase = customTypes.deepCopy(this.state.moduleDatabase);
    var modulesArray = addedItems[index].modules;
    for (var i = 0; i < modulesArray.length; i++) {
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == modulesArray[i]._id) {
          moduleDatabase[j].available += modulesArray[i].selected;
          break;
        }
      }
    }
    addedItems.splice(index, 1);
    this.setState({ moduleDatabase, addedItems });
  }

  temp = () => {
    return this.state.moduleDatabase.map((module, i) => {
      return <p key={i}>{module.description}: {module.available}</p>
    })
  }

  render() {
    return (
      <Box
        title={this.title}
        closeBox={this.props.closeProductSelection}
        width="1000px">
        {this.temp()}
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
              toggleModularScreen={this.toggleModularScreen}/>
            {this.state.modularScreenOpen > 0 ?
              <ModularScreen
                modularScreenType={this.state.modularScreenOpen}
                pack={this.state.modularContainer}
                moduleDatabase={this.state.moduleDatabase}
                addModular={this.addModular}
                editModular={this.editModular}
                toggleModularScreen={this.toggleModularScreen}
              />
            : null}
          </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.closeProductSelection()},
            {text: "Salvar", onClick: () => this.saveEdits()}
          ]}/>
      </Box>
    )
  }
}