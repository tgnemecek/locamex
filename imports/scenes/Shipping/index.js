import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Contracts } from '/imports/api/contracts/index';
import { Series } from '/imports/api/series/index';
import { Containers } from '/imports/api/containers/index';
import { Places } from '/imports/api/places/index';
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

  setProducts = () => {
    function splitContainers(arr, which) {
      return arr.filter((item) => {
        return item.type === which;
      })
    }
    if (this.props.contract) {
      this.setState({
        fixed: splitContainers(this.props.contract.containers, 'fixed'),
        modular: splitContainers(this.props.contract.containers, 'modular'),
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
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('containersPub');
  Meteor.subscribe('placesPub');
  Meteor.subscribe('modulesPub');
  Meteor.subscribe('accessoriesPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });

  var seriesDatabase = Series.find().fetch();
  var modelsDatabase = Containers.find().fetch();
  var placesDatabase = Places.find().fetch();
  var modulesDatabase = Modules.find().fetch();
  var accessoriesDatabase = Accessories.find().fetch();

  return {
    contract,

    seriesDatabase,
    modelsDatabase,
    placesDatabase,
    modulesDatabase,
    accessoriesDatabase
  }

})(Shipping);