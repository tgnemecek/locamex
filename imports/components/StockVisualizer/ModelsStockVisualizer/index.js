import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

class ModelsStockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item.models[0],
      totalItems: this.props.item.models[0].place.reduce((acc, cur) => {
        return acc + (cur.available + cur.inactive);
      }, 0),
      modelIndex: 0,
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

  renderModels = () => {
    return this.props.item.models.map((model, i) => {
      return <option key={i} value={i}>{"Modelo " + tools.convertToLetter(i)}</option>
    })
  }

  changeModel = (e) => {
    var modelIndex = e.target.value;
    debugger;
    this.setState({
      modelIndex,
      item: this.props.item.models[modelIndex],
      totalItems: this.props.item.models[modelIndex].place.reduce((acc, cur) => {
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
      this.setState({ errorMsg: 'As quantidades nos pátios devem equivaler ao estoque total.', errorKeys: ['sum'] });
    } else {
      var _id = this.props.item._id;
      var models = tools.deepCopy(this.props.item.models);
      models[this.state.modelIndex] = this.state.item;

      Meteor.call('accessories.stock.models.update', _id, models);
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
        <Block columns={2}>
          <div style={{marginTop: '9px'}}>
            {this.props.item.description}
          </div>
          <div>
            <Input
              type="select"
              onChange={this.changeModel}
              value={this.state.modelIndex}>
            {this.renderModels()}
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
      </Box>
    )
  }
}

export default ModelsStockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(ModelsStockVisualizer);