import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Containers } from '/imports/api/containers/index';
import { Packs } from '/imports/api/packs/index';
import { Services } from '/imports/api/services/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import SearchBar from '/imports/components/SearchBar/index';

import DatabaseSide from './DatabaseSide/index';
import AddedItemsSide from './AddedItemsSide/index';
import ModularScreen from './ModularScreen/index';
import PackScreen from './PackScreen/index';

export default class ProductSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      pub: '',
      dbName: '',
      addedItems: this.props.addedItems ? tools.deepCopy(this.props.addedItems) : [],
      moduleDatabase: [],
      modularScreenOpen: 0,
      packScreenOpen: 0,
      containerInFocus: '',
      modularCount: 0
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
      case 'accessories':
        this.title = "Seleção de Acessórios";
        this.state.pub = 'accessoriesPub';
        this.state.dbName = Accessories;
        break;
    }
  }

  // GENERAL -------------------------------------------------------------------

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe(this.state.pub);
      Meteor.subscribe('modulesPub');
      var fullDatabase = this.state.dbName.find().fetch();
      if (this.props.database == 'containers') {
        Meteor.subscribe('packsPub');
        var packsDatabase = Packs.find().fetch();
        fullDatabase = fullDatabase.concat(packsDatabase);
      }

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
      }, () => { this.calculations() });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
  }

  calculations = () => {
    var modularCount = 0;
    var addedItems = tools.deepCopy(this.state.addedItems);
    var moduleDatabase = tools.deepCopy(this.state.moduleDatabase);
    var filteredDatabase = tools.deepCopy(this.state.filteredDatabase);
    addedItems.forEach((pack) => {
      if (pack.type !== 'fixed' && this.props.database === 'containers') {
        var usedModules = pack.modules;
        modularCount++;
        for (var i = 0; i < usedModules.length; i++) {
          for (var j = 0; j < moduleDatabase.length; j++) {
            if (moduleDatabase[j]._id == usedModules[i]._id) {
              moduleDatabase[j].available -= usedModules[i].quantity * pack.quantity;
              break;
            }
          }
        }
      }
      for (var j = 0; j < filteredDatabase.length; j++) {
        if (pack._id == filteredDatabase[j]._id) {
          filteredDatabase[j].added = true;
        }
      }
    })
    this.setState({ addedItems, moduleDatabase, modularCount, filteredDatabase });
  }

  modifyModuleQuantity = (_id, quantity) => {
    var moduleDatabase = this.state.moduleDatabase;
    for (var i = 0; i < moduleDatabase.length; i++) {
      if (moduleDatabase[i]._id == _id) {
        moduleDatabase[i].quantity += quantity;
      }
    }
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
      if (item.quantity > 0 || item.type !== 'fixed') newArray.push(item);
    })
    this.props.saveEdits(newArray);
    this.props.closeProductSelection();
  }

  // FIXED ---------------------------------------------------------------------

  addItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase = tools.deepCopy(this.state.filteredDatabase);
    var addedItems = tools.deepCopy(this.state.addedItems);
    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id === _id) {
        filteredDatabase[i].added = true;
        filteredDatabase[i].quantity = 1;
        addedItems.push(filteredDatabase[i]);
        break;
      }
    }
    this.setState({ addedItems, filteredDatabase });
  }

  removeItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase = tools.deepCopy(this.state.filteredDatabase);
    var addedItems = tools.deepCopy(this.state.addedItems);

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

  // MODULAR -------------------------------------------------------------------

  toggleModularScreen = (e) => {
    var modularScreenOpen = 0;
    var containerInFocus = '';
    if (!e) {
      this.setState({ modularScreenOpen, containerInFocus });
      return;
    }
    var _id = e.target.value;
    var requestFrom = e.target.name;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = this.state.addedItems;
    var databaseToSearch;
    if (requestFrom == "database") {
      databaseToSearch = filteredDatabase;
      modularScreenOpen = 1;
    } else if (requestFrom == "addedItems") {
      databaseToSearch = addedItems;
      modularScreenOpen = 2;
    }
    for (var i = 0; i < databaseToSearch.length; i++) {
      if (this.state.modularScreenOpen == 0) {
        if (databaseToSearch[i]._id === _id) {
          containerInFocus = databaseToSearch[i];
        }
      } else break;
    }
    this.setState({ modularScreenOpen, containerInFocus });
  }

  addModular = (modular) => {
    var addedItems = tools.deepCopy(this.state.addedItems);
    var moduleDatabase = tools.deepCopy(this.state.moduleDatabase);
    var usedModules = modular.modules;
    var modularCount = this.state.modularCount;
    var _id = "P" + (modularCount.toString().padStart(3, '0'));
    modularCount++;
    modular._id = _id;
    addedItems.push(modular);
    for (var i = 0; i < usedModules.length; i++) {
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == usedModules[i]._id) {
          moduleDatabase[j].available -= usedModules[i].quantity * modular.quantity;
          break;
        }
      }
    }
    this.setState({ addedItems, moduleDatabase, modularCount });
    this.toggleModularScreen();
  }

  editModular = (modular) => {
    var addedItems = tools.deepCopy(this.state.addedItems);
    var moduleDatabase = tools.deepCopy(this.state.moduleDatabase);
    var oldModules;
    var oldQuantity;
    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == modular._id && addedItems[i].type !== 'fixed') {
        oldModules = tools.deepCopy(addedItems[i].modules);
        oldQuantity = addedItems[i].quantity;
        addedItems[i] = {...modular};
        break;
      }
    }
    var usedModules = modular.modules;
    for (var i = 0; i < usedModules.length; i++) {
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == usedModules[i]._id) {
          moduleDatabase[j].available += oldModules[i].quantity * oldQuantity;
          moduleDatabase[j].available -= usedModules[i].quantity * modular.quantity;
          break;
        }
      }
    }
    this.setState({ addedItems, moduleDatabase });
    this.toggleModularScreen();
  }

  removeModular = (modular) => {
    var addedItems = tools.deepCopy(this.state.addedItems);
    var moduleDatabase = tools.deepCopy(this.state.moduleDatabase);
    var oldModules;
    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == modular._id) {
        oldModules = tools.deepCopy(addedItems[i].modules);
        addedItems.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < oldModules.length; i++) {
      for (var j = 0; j < moduleDatabase.length; j++) {
        if (moduleDatabase[j]._id == oldModules[i]._id) {
          moduleDatabase[j].available += oldModules[i].quantity;
          break;
        }
      }
    }
    this.setState({ addedItems, moduleDatabase }, () => {
      this.toggleModularScreen();
    });
  }

  // PACK ----------------------------------------------------------------------

  togglePackScreen = (e) => {
    var packScreenOpen = 0;
    var containerInFocus = '';
    if (!e) {
      this.setState({ packScreenOpen, containerInFocus });
      return;
    }
    var _id = e.target.value;
    var requestFrom = e.target.name;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = this.state.addedItems;
    var databaseToSearch;
    if (requestFrom == "database") {
      databaseToSearch = filteredDatabase;
      packScreenOpen = 1;
    } else if (requestFrom == "addedItems") {
      databaseToSearch = addedItems;
      packScreenOpen = 2;
    }
    for (var i = 0; i < databaseToSearch.length; i++) {
      if (this.state.modularScreenOpen == 0) {
        if (databaseToSearch[i]._id === _id) {
          containerInFocus = databaseToSearch[i];
          break;
        }
      } else break;
    }
    this.setState({ packScreenOpen, containerInFocus });
  }

  addPack = () => {
    var pack = this.state.containerInFocus;
    var filteredDatabase = tools.deepCopy(this.state.filteredDatabase);
    var addedItems = tools.deepCopy(this.state.addedItems);
    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id === pack._id) {
        filteredDatabase[i].added = true;
        filteredDatabase[i].quantity = 1;
        addedItems.push(filteredDatabase[i]);
        break
      }
    }
    this.setState({ addedItems, filteredDatabase });
    this.togglePackScreen();
  }

  removePack = () => {
    var containerInFocus = this.state.containerInFocus;
    var _id = containerInFocus._id;
    var filteredDatabase = tools.deepCopy(this.state.filteredDatabase);
    var addedItems = tools.deepCopy(this.state.addedItems);

    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id == _id) {
        addedItems.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id == _id) {
        filteredDatabase[i].added = false;
      }
    }
    this.setState({ addedItems, filteredDatabase }, () => {
      this.togglePackScreen();
    });
  }

  render() {
    return (
      <Box
        title={this.title}
        closeBox={this.props.closeProductSelection}
        width="1200px">
          <Block columns={2}>
            <SearchBar
              database={this.state.fullDatabase}
              options={{onlySearchHere: ['description']}}
              searchReturn={this.searchReturn}/>
            <div style={{marginTop: "30px"}}>
              <label>Itens Adicionados no Contrato:</label>
            </div>
            <DatabaseSide
              database={this.state.filteredDatabase}
              databaseType={this.props.database}
              addItem={this.addItem}
              fullDatabase={this.state.fullDatabase}
              togglePackScreen={this.togglePackScreen}
              toggleModularScreen={this.toggleModularScreen}/>
            <AddedItemsSide
              database={this.props.database}
              databaseType={this.props.database}
              changePrice={this.changePrice}
              changeQuantity={this.changeQuantity}
              addedItems={this.state.addedItems}
              removeItem={this.removeItem}
              togglePackScreen={this.togglePackScreen}
              toggleModularScreen={this.toggleModularScreen}/>
          </Block>
          {this.state.modularScreenOpen > 0 ?
            <ModularScreen
              modularScreenType={this.state.modularScreenOpen}
              pack={this.state.containerInFocus}
              moduleDatabase={this.state.moduleDatabase}
              addModular={this.addModular}
              editModular={this.editModular}
              removeModular={this.removeModular}
              toggleModularScreen={this.toggleModularScreen}
            />
          : null}
          {this.state.packScreenOpen ?
            <PackScreen
              packScreenType={this.state.packScreenOpen}
              item={this.state.containerInFocus}
              toggleWindow={this.togglePackScreen}
              removePack={this.removePack}
              addPack={this.addPack}/>
          : null}
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.closeProductSelection()},
            {text: "Salvar", onClick: () => this.saveEdits()}
          ]}/>
      </Box>
    )
  }
}