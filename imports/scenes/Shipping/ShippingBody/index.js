import React from 'react';

import tools from '/imports/startup/tools/index';

import ShippingModules from './ShippingModules/index';
import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';

import Observations from './Observations/index';

export default class ShippingBody extends React.Component {
  sortSeriesDatabase = () => {
    var seriesDatabase = tools.deepCopy(this.props.databases.seriesDatabase);
    return seriesDatabase.sort((a, b) => {
      var comparison = a.place.localeCompare(b.place);
      if (comparison === 0) {
        return a.serial.toString().localeCompare(b.serial.toString());
      } else return comparison;
    })
  }

  filterModulesDatabase = () => {
    return this.props.databases.modulesDatabase.filter((item) => {
      return this.props.allowedModules.includes(item._id);
    })
  }

  render() {
    return (
      <div>
        <ShippingModules
          onChange={this.props.onChange}
          modules={this.props.modules}
          modulesEnabled={this.props.modulesEnabled}
          Observations={Observations}

          modulesDatabase={this.filterModulesDatabase()}
          placesDatabase={this.props.databases.placesDatabase}/>
        <ShippingFixed
          onChange={this.props.onChange}
          fixed={this.props.fixed}
          Observations={Observations}

          containersDatabase={this.props.databases.containersDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          seriesDatabase={this.sortSeriesDatabase()}/>
        <ShippingAccessories
          onChange={this.props.onChange}
          accessories={this.props.accessories}
          Observations={Observations}

          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
      </div>
    )
  }
}