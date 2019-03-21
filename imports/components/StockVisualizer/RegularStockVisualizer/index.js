import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

class RegularStockVisualizer extends React.Component {
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

  onChange = (object) => {
    this.setState({...object});
  }

  changeTotal = (modifier) => {
    this.setState({ totalItems: this.state.totalItems + modifier, errorMsg: '', errorKeys: [] });
  }

  countSumItems = () => {
    return this.state.item.place.reduce((acc, cur) => {
      return acc + (cur.available + cur.inactive);
    }, 0);
  }

  saveEdits = () => {
    if (this.countSumItems() !== this.state.totalItems) {
      this.setState({ errorMsg: 'As quantidades nos pátios devem equivaler ao estoque total.', errorKeys: ['sum'] });
    } else {
      if (this.props.item.type === 'accessory') {
        Meteor.call('accessories.stock.update', this.state.item);
      } else if (this.props.item.type === 'module') {
        Meteor.call('modules.stock.update', this.state.item);
      }
      this.props.toggleWindow();
    }
  }

  render() {
    return (
      <Box
        title="Visualizador de Estoque"
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
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
      </Box>
    )
  }
}

export default RegularStockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(RegularStockVisualizer);