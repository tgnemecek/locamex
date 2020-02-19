import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import VariationsFilter from './VariationsFilter/index';
import Distribution from './Distribution/index';
import BuySell from './BuySell/index';

class StockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variationIndex: 0,
      item: tools.deepCopy(this.props.item),
      variations: tools.deepCopy(this.props.variations),
      offset: 0,
      errorMsg: '',
      databaseStatus: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.variations !== this.props.variations) {
      this.setState({ variations: this.props.variations });
    }
  }

  updateItem = (places) => {
    if (this.props.item.type === 'module') {
      var item = {...this.state.item};
      item.places = places;
      this.setState({ item });
    } else {
      var variations = [...this.state.variations];
      var index = this.state.variationIndex;
      variations[index] = {
        ...variations[index],
        places
      };
      this.setState({ variations });
    }
  }

  setVariationIndex = (variationIndex) => {
    this.setState({ variationIndex });
  }

  setOffset = (offset, callback) => {
    if (this.getTotalGoal() + offset < 0) return;
    offset += this.state.offset;
    this.setState({ offset }, callback)
  }

  getPlaces = () => {
    function joinPlaces(placesInItem, placesDatabase) {
      if (!placesInItem) return placesDatabase;
      return placesDatabase.map((place) => {
        var existing = placesInItem.find((placeInItem) => {
          return placeInItem._id === place._id;
        }) || {}
        return {
          _id: place._id,
          description: place.description,
          available: existing.available || 0,
          inactive: existing.inactive || 0
        }
      })
    }

    if (this.props.item.type === 'module') {
      return joinPlaces(this.state.item.places,
         this.props.database);
    } else {
      var index = this.state.variationIndex;
      var variation = this.state.variations[index] || {};
      return joinPlaces(variation.places,
         this.props.database);
    }
  }

  getSumOfPlaces = () => {
    var places;
    if (this.props.item.type === 'module') {
      places = this.state.item.places;
    } else {
      places = [];
      this.state.variations.forEach((variation) => {
        places = [...places, ...variation.places];
      })
    }

    return places.reduce((acc, cur) => {
      return acc + cur.available + cur.inactive
    }, 0)
  }

  getTotalGoal = () => {
    var places;
    if (this.props.item.type === 'module') {
      places = this.props.item.places;
    } else {
      places = [];
      this.props.variations.forEach((variation) => {
        places = [...places, ...variation.places];
      })
    }
    return this.state.offset + places.reduce((acc, cur) => {
      return acc + cur.available + cur.inactive;
    }, 0)
  }

  saveEdits = () => {
    var current = this.getSumOfPlaces();
    var goal = this.getTotalGoal();
    var difference = goal - current;
    if (difference === 0) {
      this.setState({ databaseStatus: "loading" }, () => {
        var method;
        var data;
        if (this.props.item.type === 'module') {
          method = 'modules.update';
          data = this.state.item;
        } else {
          method = 'variations.update.stock';
          data = this.state.variations;
        }

        Meteor.call(method, data, (err, res) => {
          var status = {}
          if (res) {
            status.status = "completed";
            status.callback = this.props.toggleWindow
          }
          if (err) {
            status.status = "failed";
            status.message = tools.translateError(err);
          }
          this.setState({databaseStatus: status})
        })
      })
    } else {
      this.setState({
        errorMsg: 'O estoque nos pátios deve equivaler ao estoque total.'
      })
    }
  }

  render() {
    return (
      <Box
        title="Visualizador de Estoque"
        subtitle={`Produto: ${this.props.item.description}`}
        className="stock-visualizer"
        closeBox={this.props.toggleWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          {this.props.item.type === 'module' ? null :
            <VariationsFilter
              setVariationIndex={this.setVariationIndex}
              variationIndex={this.state.variationIndex}
              variations={this.props.variations}/>
          }
          <Distribution
            updateItem={this.updateItem}
            places={this.getPlaces()}/>
          <BuySell
            offset={this.state.offset}
            setOffset={this.setOffset}
            totalGoal={this.getTotalGoal()}
            sumOfPlaces={this.getSumOfPlaces()}/>
          <FooterButtons buttons={[
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Salvar",
            className: "button--primary",
            onClick: this.saveEdits}
          ]}/>
          <DatabaseStatus status={this.state.databaseStatus}/>
      </Box>
    )
  }
}

export default StockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var database = Places.find({visible: true}).fetch() || [];
  return {
    database
  }
})(StockVisualizer);