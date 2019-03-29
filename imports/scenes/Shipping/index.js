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

      allowedModules: []
    }
  }

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contract && this.props.contract) {
      if (prevProps.contract.containers !== this.props.contract.containers ||
          prevProps.contract.accessories !== this.props.contract.accessories) {
        this.setup();
      }
    }
  }

  onChange = (changes) => {
    this.setState({
      ...this.state,
      ...changes
    })
  }

  setup = () => {
    const setFixed = () => {
      var newArray = [];
      this.props.contract.containers.forEach((item) => {
        if (item.type === 'fixed') {
          for (var i = 0; i < item.renting; i++) {
            var productFromDatabase = tools.findUsingId(this.props.databases.containersDatabase, item.productId);
            newArray.push({
              _id: tools.generateId(),
              productId: item.productId,
              seriesId: '',
              description: productFromDatabase.description
            })
          }
        }
      })
      return newArray;
    }

    const setAllowedModules = () => {
      var allowedModules = [];
      var modularList = [];
      if (!this.props.databases.containersDatabase.length) return [];
      this.props.contract.containers.forEach((container) => {
        if (container.type === 'modular') {
          var productFromDatabase = tools.findUsingId(this.props.databases.containersDatabase, container.productId);

          productFromDatabase.allowedModules.forEach((module) => {
            if (!allowedModules.includes(module)) {
              allowedModules.push(module);
            }
          })
        }
      })
      return allowedModules;
    }

    const setAccessories = () => {
      var newArray = [];
      this.props.contract.accessories.forEach((item) => {
        var productFromDatabase = tools.findUsingId(this.props.databases.accessoriesDatabase, item.productId);
        newArray.push({
          _id: tools.generateId(),
          productId: item.productId,
          renting: item.renting,
          selected: '',
          description: productFromDatabase.description
        })
      })
      return newArray;
    }

    if (this.props.contract) {
      this.setState({
        fixed: setFixed(),
        allowedModules: setAllowedModules(),
        accessories: setAccessories()
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
            modules={this.state.modules}
            modulesEnabled={!!this.state.allowedModules}
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