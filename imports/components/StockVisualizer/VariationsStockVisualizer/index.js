import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

class VariationsStockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item.variations[0],
      totalItems: this.props.item.variations[0].place.reduce((acc, cur) => {
        return acc + (cur.available + cur.inactive);
      }, 0),
      variationIndex: 0,
      errorMsg: ''
    }
  }

  onChange = (object) => {
    this.setState({...object});
  }

  changeTotal = (modifier) => {
    this.setState({ totalItems: this.state.totalItems + modifier, errorMsg: '' });
  }

  renderVariations = () => {
    return this.props.item.variations.map((variation, i, array) => {
      const label = () => {
        if (array.length > 1) {
          return "Padrão " + tools.convertToLetter(i);
        } else return "Padrão Único";
      }
      return <option key={i} value={i}>{label()}</option>
    })
  }

  changeVariation = (e) => {
    var variationIndex = e.target.value;
    this.setState({
      variationIndex,
      item: this.props.item.variations[variationIndex],
      totalItems: this.props.item.variations[variationIndex].place.reduce((acc, cur) => {
        return acc + (cur.available + cur.inactive);
      }, 0),
    });
  }

  countSumItems = () => {
    return this.state.item.place.reduce((acc, cur) => {
      return acc + (cur.available + cur.inactive);
    }, 0);
  }

  saveEdits = () => {
    if (this.countSumItems() !== this.state.totalItems) {
      this.setState({ errorMsg: 'As quantidades nos pátios devem equivaler ao estoque total.' });
    } else {
      var _id = this.props.item._id;
      var variations = [...this.props.item.variations];
      variations[this.state.variationIndex] = this.state.item;

      Meteor.call('accessories.update.stock', _id, variations);
      this.props.toggleWindow();
    }
  }

  render() {
    return (
      <>
        <div className="error-message">{this.state.errorMsg}</div>
        <Block columns={2}>
          <div style={{marginTop: '9px'}}>
            {this.props.item.description}
          </div>
          <div>
            <Input
              type="select"
              onChange={this.changeVariation}
              value={this.state.variationIndex}>
            {this.renderVariations()}
            </Input>
          </div>
        </Block>
        <this.props.PlacesBlock
          itemId={this.props.item._id}
          item={this.state.item}
          placesDatabase={this.props.placesDatabase}
          onChange={this.onChange}
        />
        <this.props.BuySell
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
      </>
    )
  }
}

export default VariationsStockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(VariationsStockVisualizer);