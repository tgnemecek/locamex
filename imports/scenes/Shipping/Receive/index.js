import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import ReceiveModules from './ReceiveModules/index';
import ReceiveFixed from './ReceiveFixed/index';
import ReceiveAccessories from './ReceiveAccessories/index';
import Footer from './Footer/index';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);

    const setAccessories = () => {
      var spreadAccessories = [];
      this.props.contract.shipping.accessories.forEach((accessory) => {
        var tempArray = [];
        accessory.selected.forEach((selected) => {
          var existing = tempArray.find((item) => item.variationIndex === selected.variationIndex);
          if (existing) {
            existing.selected = existing.selected + selected.selected;
          } else tempArray.push({
            ...selected,
            description: accessory.description,
            place: "",
            productId: accessory.productId
          });
        })
        spreadAccessories = spreadAccessories.concat(tempArray);
      })
      return spreadAccessories;
    }


    this.state = {
      fixed: this.props.contract.shipping.fixed || [],
      modules: this.props.contract.shipping.modules || [],
      accessories: setAccessories(),
      databaseStatus: false
    }
  }

  onChange = (changes) => {
    this.setState({
      ...this.state,
      ...changes
    })
  }

  receiveProducts = () => {
    var data = {
      ...this.state,
      type: 'receive'
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.shipping.receive', this.props.contract._id, data, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: "completed" }, () => {
            this.props.toggleReceive();
          });
        } if (err) {
          this.setState({ databaseStatus: "failed" });
        }
      });
    })
  }

  render() {
    return (
      <Box closeBox={this.props.toggleReceive} title="Realizar Nova Devolução" width="900px">
        <ReceiveFixed
          onChange={this.onChange}
          fixed={this.state.fixed}

          containersDatabase={this.props.databases.containersDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <ReceiveModules
          onChange={this.onChange}
          modules={this.state.modules}

          modulesDatabase={this.props.databases.modulesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <ReceiveAccessories
          onChange={this.onChange}
          accessories={this.state.accessories}

          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}/>
        <Footer
          fixed={this.state.fixed}
          modules={this.state.modules}
          accessories={this.state.accessories}
          receiveProducts={this.receiveProducts}
          />
          <DatabaseStatus status={this.state.databaseStatus} />
      </Box>
    )
  }
}