import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import BuySell from './BuySell/index';

class StockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      totalItems: this.props.item.place.reduce((acc, cur) => {
        return acc + (cur.available + cur.inactive);
      }, 0),
      errorMsg: '',
      errorKeys: []
    }
  }

  changeTotal = (modifier) => {
    this.setState({ totalItems: this.state.totalItems + modifier, errorMsg: '', errorKeys: [] });
  }

  countSumItems = () => {
    return this.state.item.place.reduce((acc, cur) => {
      return acc + (cur.available + cur.inactive);
    }, 0);
  }

  renderBody = () => {
    var placesDatabase = this.props.placesDatabase;

    var itemId = this.props.item._id;
    var placesInItem = tools.deepCopy(this.state.item.place);

    return placesDatabase.map((place, i) => {
      const changeValue = (e) => {
        var value = e.target.value;
        var name = e.target.name;
        var index = placesInItem.findIndex((placeInItem) => {
          return placeInItem._id === place._id
        })
        if (index === -1) { // The place is not in the item
          placesInItem.push({
            _id: place._id,
            available: 0,
            inactive: 0,
            [name]: value
          })
        } else placesInItem[index][name] = value;

        var item = {...this.state.item, place: placesInItem};
        this.setState({ item, errorMsg: '', errorKeys: [] });
      }
      const findQuantity = (which) => {
        var result = 0;
        placesInItem.forEach((placeInItem) => {
          if (placeInItem._id === place._id) result = placeInItem[which] || 0;
        })
        return result;
      }
      return (
        <Block
          key={i}
          columns={3}
          options={[{block: 0, span: 2}, {block: 1, span: 0.5}, {block: 2, span: 0.5}]}
          className="stock-visualizer__place-block">
          <div><label>{place.description}</label></div>
          <Input type="number" name="available" style={{color: "green", textAlign: "right"}} onChange={changeValue} value={findQuantity("available")}/>
          <Input type="number" name="inactive" style={{color: "red", textAlign: "right"}} onChange={changeValue} value={findQuantity("inactive")}/>
        </Block>
      )
    })
  }

  saveEdits = () => {
    if (this.countSumItems() !== this.state.totalItems) {
      this.setState({ errorMsg: 'As quantidades nos pátios devem equivaler ao estoque total.', errorKeys: ['sum'] });
    } else {
      if (this.props.item.type === 'accessory') {
        Meteor.call('accessories.stock.update', this.state.item);
      }
      this.props.toggleWindow();
    }
  }

  render() {
    return (
      <Box
        title="Visualizador de Estoque:"
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
        <Block columns={2} title={this.state.item.description}>
          {this.renderBody()}
        </Block>
        <BuySell
          item={this.state.item}
          totalItems={this.state.totalItems}
          changeTotal={this.changeTotal}
          sumItems={this.countSumItems()}
          errorKeys={this.state.errorKeys}
        />
        <FooterButtons buttons={[
        {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
        {text: "Salvar", onClick: this.saveEdits}
        ]}/>
      </Box>
    )
  }
}

export default StockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(StockVisualizer);