import { Meteor } from 'meteor/meteor';
import React from 'react';

// import { Services } from '/imports/api/services';
// import { Modules } from '/imports/api/modules';

import customTypes from '/imports/startup/custom-types';

import SearchBar from '/imports/components/SearchBar/index';

export default class DatabaseSide extends React.Component {

  renderDatabase = () => {
    return this.props.database.map((item, i, array) => {
      if (!item.added) {
        return (
          <tr key={i} className="product-selection__db-item">
            <td>{item._id}</td>
            <td>{item.description}</td>
            {this.props.database != 'accessories' ? null : <td>{item.available}/{item.total}</td>}
            <td><button value={item._id} onClick={item.type !== 'modular' ? this.props.addItem : this.props.toggleModularScreen}>►</button></td>
          </tr>
        )
      }
    })
  }

  addItem = (e) => {
    var addedItems = this.state.addedItems;
    var value = e.target.value;
    var item = this.state.fullDatabase[value];
    var filteredDatabase = this.state.filteredDatabase;
    item.added = true;
    item.quantity = 1;
    addedItems.push(item);
    this.setState({ addedItems, filteredDatabase });
  }

  // toggleModularScreen = (e) => {
  //   var modularScreenOpen = !this.state.modularScreenOpen;
  //   var index = e.target.value;
  //   var addedItems = this.state.addedItems;
  //   if (this.state.modularScreenOpen) {
  //     this.setState({ modularScreenOpen, moduleObj: '' })
  //   } else {
  //     var moduleObj = this.state.fullDatabase[index];
  //     for (var i = 0; i < addedItems.length; i++) {
  //       if (addedItems[i].type == 'modular') {
  //         for (var j = 0; j < addedItems[i].allowedModules.length; j++) {
  //           if (this.state.moduleDatabase) {}
  //           // addedItems[i].allowedModules[j].
  //         }
  //       }
  //     }
  //     this.setState({ modularScreenOpen, moduleObj });
  //   }
  // }
  // addModular = (container, modulesArray) => {
  //   var addedItems = this.state.addedItems;
  //   var obj = {target: {value: ''}};
  //   var alreadyIncluded = false;
  //   var moduleDatabase = this.state.moduleDatabase;
  //   container.allowedModules.forEach((module, i) => {
  //     module.selected = modulesArray[i].selected;
  //     module.description = modulesArray[i].description;
  //   });
  //   for (var i = 0; i < addedItems.length; i++) {
  //     if (addedItems[i]._id == container._id) {
  //       addedItems.splice(i, 1, container);
  //       alreadyIncluded = true;
  //       break;
  //     }
  //   }
  //     // if (addedItems[i]._id == container._id) {
  //     //   addedItems.splice(i, 1, container);
  //     //   alreadyIncluded = true;
  //     //   break;
  //     // }
  //   if (!alreadyIncluded) addedItems.push(container);
  //   this.setState({ addedItems });
  //   this.toggleModularScreen(obj);
  // }

  render() {
      return (
        <div className="product-selection__database">
          <SearchBar
            hiddenOption="description"
            database={this.props.fullDatabase}
            searchReturn={this.props.searchReturn}/>
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
      )
  }
}