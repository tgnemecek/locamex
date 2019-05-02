import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import ShippingModules from './ShippingModules/index';
import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';
import Footer from './Footer/index';

export default class NewShipping extends React.Component {
  sortSeriesDatabase = () => {
    var seriesDatabase = tools.deepCopy(this.props.databases.seriesDatabase);
    return seriesDatabase.sort((a, b) => {
      var comparison = a.place.localeCompare(b.place);
      if (comparison === 0) {
        return a._id.localeCompare(b._id);
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
      <Box closeBox={this.props.toggleNewShipping} title="Realizar Nova Remessa">
        <ShippingFixed
          onChange={this.props.onChange}
          fixed={this.props.fixed}

          containersDatabase={this.props.databases.containersDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          seriesDatabase={this.sortSeriesDatabase()}/>
        {!!this.props.allowedModules.length ?
          <ShippingModules
            onChange={this.props.onChange}
            modules={this.props.modules}

            modulesDatabase={this.filterModulesDatabase()}
            placesDatabase={this.props.databases.placesDatabase}/>
        : null}
        <ShippingAccessories
          onChange={this.props.onChange}
          accessories={this.props.accessories}

          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <Footer
          fixed={this.props.fixed}
          modules={this.props.modules}
          accessories={this.props.accessories}
          invalidFields={this.props.invalidFields}
          sendProducts={this.props.sendProducts}
          />
      </Box>
    )
  }
}