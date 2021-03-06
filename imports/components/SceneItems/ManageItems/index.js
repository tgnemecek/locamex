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
      filteredDatabase: [],
      addedItems: this.props.master[this.props.type] || []
    }
  }

  componentDidMount() {
    this.setState({
      filteredDatabase: this.hideFromArray(this.props.fullDatabase)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        filteredDatabase: this.hideFromArray(this.props.fullDatabase)
      })
    }
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
        item.renting = value;
      }
    })
    this.setState({ addedItems });
  }

  filterSearch = (filteredDatabase) => {
    if (filteredDatabase) {
      filteredDatabase = this.hideFromArray(filteredDatabase);
    } else {
      filteredDatabase = this.hideFromArray(this.props.fullDatabase);
    }
    this.setState({ filteredDatabase });
  }

  hideFromArray = (toFilter, addedItems) => {
    debugger;
    addedItems = addedItems || this.state.addedItems;

    return toFilter.filter((item) => {
      for (var i = 0; i < addedItems.length; i++) {
        if (item._id === addedItems[i].productId) {
          return false;
        }
      }
      return true;
    })
  }

  addItem = (_id) => {
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = [...this.state.addedItems];

    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id === _id) {
        addedItems.push({
          _id: tools.generateId(),
          description: filteredDatabase[i].description,
          productId: filteredDatabase[i]._id,
          type: filteredDatabase[i].type,
          price: filteredDatabase[i].price,
          restitution: filteredDatabase[i].restitution,
          renting: 1
        });
        filteredDatabase = this.hideFromArray(filteredDatabase, addedItems);
        break;
      }
    }
    this.setState({ addedItems, filteredDatabase });
  }

  removeItem = (_id) => {
    var filteredDatabase;
    var addedItems = [...this.state.addedItems];

    for (var i = 0; i < addedItems.length; i++) {
      if (addedItems[i]._id === _id) {
        addedItems.splice(i, 1);
      }
    }
    filteredDatabase = this.hideFromArray(this.props.fullDatabase, addedItems);
    this.setState({ addedItems, filteredDatabase });
  }

  saveEdits = () => {
    var addedItems = this.state.addedItems;
    var newArray = [];
    addedItems.forEach((item) => {
      if (item.renting > 0) newArray.push(item);
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
            <SearchBar
              database={this.props.fullDatabase}
              searchHere={['description']}
              filterSearch={this.filterSearch}/>
            <div style={{marginTop: "30px"}}>
              <label>{`${this.title()} Adicionados:`}</label>
            </div>
            <Database
              database={this.state.filteredDatabase}
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