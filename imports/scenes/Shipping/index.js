import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';

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
      modules: [],
      accessories: [],
      modulesEnabled: false,
      allowedModules: []
    }
  }

  componentDidMount() {
    this.setProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contract && this.props.contract) {
      if (prevProps.contract.containers !== this.props.contract.containers ||
          prevProps.contract.accessories !== this.props.contract.accessories) {
        this.setProducts();
      }
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

    const setAllowedModules = () => {
      if (!this.props.databases.containersDatabase.length) return [];
      var allowedModules = [];
      var modularList = [];
      this.props.contract.containers.forEach((container) => {
        if (container.type === 'modular') {
          modularList.push(tools.findUsingId(this.props.databases.containersDatabase, container._id))
        }
      })
      modularList.forEach((modular) => {
        modular.allowedModules.forEach((module) => {
          if (!allowedModules.includes(module)) {
            allowedModules.push(module);
          }
        })
      })
      return allowedModules;
    }

    if (this.props.contract) {
      var allowedModules = setAllowedModules();
      this.setState({
        fixed: setFixed(),
        modulesEnabled: !!allowedModules.length,
        allowedModules,
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
            databases={this.props.databases}
            onChange={this.onChange}
            fixed={this.state.fixed}
            modulesEnabled={this.state.modulesEnabled}
            modules={this.state.modules}
            allowedModules={this.state.allowedModules}
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

  var databases = {
    placesDatabase: Places.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch()
  }

  return { contract, databases }

})(Shipping);