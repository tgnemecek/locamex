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
import ShippingList from './ShippingList/index';

class StockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variationIndex: 0,
      item: tools.deepCopy(this.props.item),
      offset: 0,
      errorMsg: '',
      databaseStatus: false
    }
  }

  updateItem = (places) => {
    var item = {...this.state.item};
    if (this.props.item.type === 'module') {
      item.places = places;
    } else {
      var index = this.state.variationIndex;
      item.variations[index] = {
        ...item.variations[index],
        places
      };
    }
    this.setState({ item });
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
      var variations = this.state.item.variations;
      var current = variations[this.state.variationIndex];
      return joinPlaces(current.places, this.props.database);
    }
  }

  getSumOfPlaces = () => {
    var places;
    if (this.props.item.type === 'module') {
      places = this.state.item.places;
    } else {
      places = [];
      this.state.item.variations.forEach((item) => {
        places = [...places, ...item.places];
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
      this.props.item.variations.forEach((item) => {
        places = [...places, ...item.places];
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
        if (this.props.item.type === 'module') {
          method = 'modules.update';
        } else method = 'accessories.update';

        Meteor.call(method, this.state.item, (err, res) => {
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
        className="stock-visualizer"
        closeBox={this.props.toggleWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          <div className="stock-visualizer__top">
            <h4>Produto: {this.props.item.description}</h4>
            <VariationsFilter
              setVariationIndex={this.setVariationIndex}
              variationIndex={this.state.variationIndex}
              variations={this.props.item.variations}/>
          </div>
          <Distribution
            isShipping={this.props.isShipping}
            updateItem={this.updateItem}
            places={this.getPlaces()}/>
          {!this.props.isShipping ?
            <BuySell
              offset={this.state.offset}
              setOffset={this.setOffset}
              totalGoal={this.getTotalGoal()}
              sumOfPlaces={this.getSumOfPlaces()}/>
          :
          <ShippingList
            places={this.props.item.places}
          />
          }
          {this.props.children}
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