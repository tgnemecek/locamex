import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FilterBar from '/imports/components/FilterBar/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Database from './Database/index';
import AddedItems from './AddedItems/index';

export default class ManageItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addedItems: this.props.snapshot[this.props.type] || [],
      searchTerm: ''
    }
  }

  filterDatabase = () => {
    function compare(inputValue, dbValue) {
      inputValue = tools.removeSpecialChars(
        inputValue,
        /[\.\/\-\(\) ]/g
      ).toUpperCase();
      dbValue = tools.removeSpecialChars(
        dbValue, /[\.\/\-\(\) ]/g
      ).toUpperCase();
      return dbValue.search(inputValue) === -1 ? false : true;
    }

    return this.props.fullDatabase.filter((dbItem) => {
      if (compare(this.state.searchTerm, dbItem.description)) {
        return !this.state.addedItems.find((addedItem) => {
          return dbItem._id === addedItem._id;
        })
      } else return false;
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

  updateSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  addItem = (item) => {
    var addedItems = [...this.state.addedItems];
    addedItems.push({
      _id: item._id,
      type: item.type,
      description: item.description,
      restitution: item.restitution,
      price: item.price,
      quantity: 1
    });
    this.setState({ addedItems });
  }

  removeItem = (i) => {
    var filteredDatabase;
    var addedItems = [...this.state.addedItems];
    addedItems.splice(i, 1);
    this.setState({ addedItems });
  }

  saveEdits = () => {
    var addedItems = this.state.addedItems;
    var newArray = [];
    addedItems.forEach((item) => {
      if (item.quantity > 0) newArray.push(item);
    })
    if (this.props.docType === 'contract') {
      this.props.updateSnapshot({
        [this.props.type]: newArray,
        billingProducts: [],
        billingServices: []
      });
    } else {
      this.props.updateSnapshot({
        [this.props.type]: newArray
      });
    }
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        className="manage-items"
        title={"Seleção de " + this.title()}
        closeBox={this.props.toggleWindow}>
          <div className="manage-items__body">
            <div>
              <div className="manage-items__subtitle">
                Banco de Dados:
              </div>
              <FilterBar
                value={this.state.searchTerm}
                onChange={this.updateSearch}/>
            </div>
            <div className="manage-items__subtitle">
              {this.title() + " Adicionados:"}
            </div>
            <Database
              database={this.filterDatabase()}
              addItem={this.addItem}/>
            <AddedItems
              type={this.props.type}
              addedItems={this.state.addedItems}

              changePrice={this.changePrice}
              changeQuantity={this.changeQuantity}
              removeItem={this.removeItem}

              togglePackScreen={this.togglePackScreen}
              toggleModularScreen={this.toggleModularScreen}/>
          </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}