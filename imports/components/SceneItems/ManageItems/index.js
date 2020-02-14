import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import SearchBar from '/imports/components/SearchBar/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Database from './Database/index';
import AddedItems from './AddedItems/index';

export default class ManageItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addedItems: this.props.master[this.props.type] || []
    }
  }

  filteredDatabase = () => {
    return this.props.fullDatabase.filter((dbItem) => {
      return !this.state.addedItems.find((addedItem) => {
        return dbItem._id === addedItem._id;
      })
    })
  }

  title = () => {
    switch (this.props.type) {
      case 'containers':
        return 'Containers';
      case 'accessories':
        return 'Accessórios';
      case 'services':
        return 'Serviços';
      default:
        return '';
    }
  }

  changePrice = (e) => {
    var _id = e.target.name;
    var value = e.target.value;
    var addedItems = [...this.state.addedItems];
    addedItems.forEach((item) => {
      if (item._id === _id) {
        item.price = value;
      }
    })
    this.setState({ addedItems });
  }

  changeQuantity = (e) => {
    var _id = e.target.name;
    var value = e.target.value;
    var addedItems = [...this.state.addedItems];
    addedItems.forEach((item) => {
      if (item._id === _id) {
        item.quantity = value;
      }
    })
    this.setState({ addedItems });
  }

  // filterSearch = (filteredDatabase) => {
  //   if (filteredDatabase) {
  //     filteredDatabase = this.hideFromArray(filteredDatabase);
  //   } else {
  //     filteredDatabase = this.hideFromArray(this.props.fullDatabase);
  //   }
  //   this.setState({ filteredDatabase });
  // }

  // hideFromArray = (toFilter, addedItems) => {
  //   addedItems = addedItems || this.state.addedItems;
  //
  //   return toFilter.filter((item) => {
  //     for (var i = 0; i < addedItems.length; i++) {
  //       if (item._id === addedItems[i].productId) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   })
  // }

  addItem = (item) => {
    var addedItems = [...this.state.addedItems];

    addedItems.push({
      ...item,
      quantity: 1
    });
    // filteredDatabase = this.hideFromArray(filteredDatabase, addedItems);
    this.setState({ addedItems });
  }

  removeItem = (i) => {
    var filteredDatabase;
    var addedItems = [...this.state.addedItems];
    addedItems.splice(i, 1);
    // filteredDatabase = this.hideFromArray(this.props.fullDatabase, addedItems);
    this.setState({ addedItems });
  }

  saveEdits = () => {
    var addedItems = this.state.addedItems;
    var newArray = [];
    addedItems.forEach((item) => {
      if (item.quantity > 0) newArray.push(item);
    })
    this.props.updateMaster({
      [this.props.type]: newArray,
      billingProducts: [],
      billingServices: []
    });
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title={"Seleção de " + this.title()}
        closeBox={this.props.toggleWindow}
        width="1200px">
          <Block columns={2}>
            <div></div>
            {/* <SearchBar
              database={this.props.fullDatabase}
              searchHere={['description']}
              filterSearch={this.filterSearch}/> */}
            <div style={{marginTop: "30px"}}>
              <label>{`${this.title()} Adicionados:`}</label>
            </div>
            <Database
              database={this.filteredDatabase()}
              addItem={this.addItem}/>
            <AddedItems
              type={this.props.type}
              addedItems={this.state.addedItems}

              changePrice={this.changePrice}
              changeQuantity={this.changeQuantity}
              removeItem={this.removeItem}

              togglePackScreen={this.togglePackScreen}
              toggleModularScreen={this.toggleModularScreen}/>
          </Block>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}