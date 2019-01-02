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
  renderQuantitative = () => {
    var placesDatabase = this.props.placesDatabase;

    var itemId = this.props.item._id;
    var placesInItem = tools.deepCopy(this.props.item.place);

    return placesDatabase.map((place, i) => {
      const changeValue = (e) => {
        var newPlaces = tools.deepCopy(placesInItem);
        var value = e.target.value;
        var name = e.target.name;
        var changesMade = false;
        for (var i = 0; i < newPlaces.length; i++) {
          if (newPlaces[i]._id === place._id) {
            newPlaces[i][name] = value;
            changesMade = true;
          }
        }
        if (!changesMade) {
          var newPlaceObject = {
            _id: place._id,
            available: 0,
            maintenance: 0
          }
          newPlaceObject[name] = value;
          newPlaces.push(newPlaceObject);
        }
        this.props.onChange({target: {value: newPlaces, name: "place"}});
      }
      const findQuantity = (which) => {
        for (var i = 0; i < placesInItem.length; i++) {
          if (placesInItem[i]._id === place._id) {
            return placesInItem[i][which] || 0;
          }
        }
        return 0;
      }
      return (
        <Block
          key={i}
          columns={3}
          options={[{block: 0, span: 2.5}, {block: 1, span: 0.25}, {block: 2, span: 0.25}]}
          className="stock-visualizer__place-block">
          <div><label>{place.description}</label></div>
          <Input type="number" name="available" style={{color: "green", textAlign: "right"}} onChange={changeValue} value={findQuantity("available")}/>
          <Input type="number" name="maintenance" style={{color: "red", textAlign: "right"}} onChange={changeValue} value={findQuantity("maintenance")}/>
        </Block>
      )
    })
  }
  renderNotQuantitative = () => {
    var placesDatabase = this.props.placesDatabase;
    const renderPlaces = () => {
      return placesDatabase.map((place, i) => {
        return <option key={i} value={place._id}>{place.description}</option>
      })
    }
    return (
      <Block
        columns={2}>
        <Input
          title="Pátio:"
          type="select"
          name="place"
          value={this.props.item.place}
          onChange={this.props.onChange}>
          {renderPlaces()}
        </Input>
        <Input
          title="Status:"
          type="select"
          name="status"
          value={this.props.item.status}
          onChange={this.props.onChange}>
          <option value="available">Disponível</option>
          <option value="maintenance">Manutenção</option>
        </Input>
      </Block>
    )
  }
  changeTotal = (increment) => {
    var totalItems = this.props.totalItems;
    var newTotal = totalItems + increment;
    this.props.onChange({target: {value: newTotal, name: "totalItems"}})
  }
  render() {
    return (
      <>
        {this.props.item.quantitative ?
          <Block title="Visualizador de Estoque" columns={2}>
            {this.renderQuantitative()}
          </Block>
        :
        this.renderNotQuantitative()
        }
        <BuySell
          item={this.props.item}
          totalItems={this.props.totalItems}
          changeTotal={this.changeTotal}
          sumItems={this.props.sumItems}
        />
      </>
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