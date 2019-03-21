import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';

import { Containers } from '/imports/api/containers/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

import Header from './Header/index';
import ShippingBody from './ShippingBody/index';

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: [],
      modular: [],
      accessories: []
    }
  }

  componentDidMount() {
    this.setProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contract !== this.props.contract) {
      this.setProducts();
    }
  }

  onChange = (changes) => {
    this.setState({
      ...this.state,
      ...changes
    })
  }

  setProducts = () => {

    const setFixed = () => {
      var newArray = [];
      this.props.contract.containers.forEach((item) => {
        if (item.type === 'fixed') {
          for (var i = 0; i < item.renting; i++) {
            newArray.push({ model: item._id })
          }
        }
      })
      return newArray;
    }

    const setModular = () => {
      return this.props.contract.containers.filter((item) => {
        return item.type === 'modular';
      })
    }

    if (this.props.contract) {
      this.setState({
        fixed: setFixed(),
        modular: setModular(),
        accessories: this.props.contract.accessories
      });
    }
  }

  render() {
    if (this.props.contract === undefined) return null;
    if (this.props.contract === null) return null; // Add NotFound Component Here!!!!!
    return (
      <div className="page-content">
        <div className="contract">
          <Header {...this.props} />
          <ShippingBody
            {...this.props}
            onChange={this.onChange}
            fixed={this.state.fixed}
            modular={this.state.modular}
            accessories={this.state.accessories}
          />
        </div>
      </div>
    )
  }
}

export default ShippingWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('placesPub');

  Meteor.subscribe('containersPub');
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('modulesPub');
  Meteor.subscribe('accessoriesPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  var placesDatabase = Places.find().fetch();

  var containersDatabase = Containers.find().fetch();
  var seriesDatabase = Series.find().fetch();
  var modulesDatabase = Modules.find().fetch();
  var accessoriesDatabase = Accessories.find().fetch();

  return {
    contract,
    placesDatabase,

    containersDatabase,
    seriesDatabase,
    modulesDatabase,
    accessoriesDatabase
  }

})(Shipping);