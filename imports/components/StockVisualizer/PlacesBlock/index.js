import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class PlacesBlock extends React.Component {
  renderBody = () => {
    var placesDatabase = this.props.placesDatabase;

    var itemId = this.props.itemId;
    var placesInItem = tools.deepCopy(this.props.item.place);

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

        var item = {...this.props.item, place: placesInItem};
        this.props.onChange({
          item,
          errorMsg: '',
          errorKeys: []
        })
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

  render() {
    return (
      <Block columns={2}>
        {this.renderBody()}
      </Block>
    )
  }
}