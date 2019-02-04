import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Services } from '/imports/api/services/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import SearchBar from '/imports/components/SearchBar/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import DatabaseSide from './DatabaseSide/index';
import AddedItemsSide from './AddedItemsSide/index';

class ServicesSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      addedItems: this.props.addedItems || []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      var filteredDatabase = this.hideFromArray(this.props.fullDatabase);
      this.setState({ filteredDatabase })
    }
  }

  changePrice = (e) => {
    var _id = e.target.name;
    var value = e.target.value;
    var addedItems = tools.deepCopy(this.state.addedItems);
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
    var addedItems = tools.deepCopy(this.state.addedItems);
    addedItems.forEach((item) => {
      if (item._id === _id) {
        item.quantity = value;
      }
    })
    this.setState({ addedItems });
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      filteredDatabase = this.hideFromArray(filteredDatabase);
    } else {
      filteredDatabase = this.hideFromArray(this.props.fullDatabase);
    }
    this.setState({ filteredDatabase });
  }

  hideFromArray = (toFilter, addedItems) => {
    addedItems = addedItems || this.state.addedItems;

    return toFilter.filter((item) => {
      for (var i = 0; i < addedItems.length; i++) {
        if (item._id === addedItems[i]._id) {
          return false;
        }
      }
      return true;
    })
  }

  addItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase = this.state.filteredDatabase;
    var addedItems = tools.deepCopy(this.state.addedItems);
    var item;

    for (var i = 0; i < filteredDatabase.length; i++) {
      if (filteredDatabase[i]._id === _id) {
        item = {...filteredDatabase[i], quantity: 1}
        addedItems.push(item);
        filteredDatabase = this.hideFromArray(filteredDatabase, addedItems);
        break;
      }
    }
    this.setState({ addedItems, filteredDatabase });
  }

  removeItem = (e) => {
    var _id = e.target.value;
    var filteredDatabase;
    var addedItems = tools.deepCopy(this.state.addedItems);

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
      if (item.quantity > 0 || item.type !== 'fixed') newArray.push(item);
    })
    this.props.saveEdits(newArray);
    this.props.closeWindow();
  }

  render() {
    return (
      <Box
        title="Seleção de Serviços"
        closeBox={this.props.closeWindow}
        width="1200px">
          <Block columns={2}>
            <SearchBar
              database={this.props.fullDatabase}
              options={{onlySearchHere: ['description']}}
              searchReturn={this.searchReturn}/>
            <div style={{marginTop: "30px"}}>
              <label>Serviços Adicionados no Contrato:</label>
            </div>
            <DatabaseSide
              database={this.state.filteredDatabase}
              addItem={this.addItem}/>
            <AddedItemsSide
              database={this.state.filteredDatabase}
              addedItems={this.state.addedItems}

              changePrice={this.changePrice}
              changeQuantity={this.changeQuantity}
              removeItem={this.removeItem}

              togglePackScreen={this.togglePackScreen}
              toggleModularScreen={this.toggleModularScreen}/>
          </Block>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.closeWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}

export default ServicesSelectionWrapper = withTracker((props) => {
  Meteor.subscribe("servicesPub");
  var fullDatabase = Services.find({visible: true}).fetch();
  return { fullDatabase }
})(ServicesSelection);