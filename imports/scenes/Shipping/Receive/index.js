import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import ReceiveModules from './ReceiveModules/index';
import ReceiveFixed from './ReceiveFixed/index';
import ReceiveAccessories from './ReceiveAccessories/index';
import Footer from './Footer/index';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    // const setAccessories = () => {
    //   var spreadAccessories = [];
    //   if (!this.props.currentlyRented.accessories) return [];
    //   this.props.currentlyRented.accessories.forEach((accessory) => {
    //     var tempArray = [];
    //     var existing = tempArray.find((item) => item.variationIndex === selected.variationIndex);
    //     if (existing) {
    //       existing.selected = existing.selected + selected.selected;
    //     } else tempArray.push({
    //       ...selected,
    //       description: accessory.description,
    //       place: "",
    //       productId: accessory.productId
    //     });
    //     accessory.selected.forEach((selected) => {
    //
    //     })
    //     if (Array.isArray(accessory.selected)) {
    //
    //     }
    //     // if (Array.isArray(accessory.selected)) {
    //     //   accessory.selected.forEach((selected) => {
    //     //     var existing = tempArray.find((item) => item.variationIndex === selected.variationIndex);
    //     //     if (existing) {
    //     //       existing.selected = existing.selected + selected.selected;
    //     //     } else tempArray.push({
    //     //       ...selected,
    //     //       description: accessory.description,
    //     //       place: "",
    //     //       productId: accessory.productId
    //     //     });
    //     //   })
    //     // }
    //     // CREATE CONDITION TO RUN CODE ABOVE IF ACC.SELECTED IS NUMBER. THEN DO THE SAME FOR MODULES.
    //     spreadAccessories = spreadAccessories.concat(tempArray);
    //   })
    //   return spreadAccessories;
    // }

    this.state = {
      fixed: this.props.currentlyRented.fixed.map((item) => {
        return {...item, place: ""}
      }),
      modules: this.props.currentlyRented.modules || [],
      accessories: this.props.currentlyRented.accessories || [],
      databaseStatus: '',
      confirmationWindow: false
    }
  }

  toggleConfirmationWindow = () => {
    this.setState({ confirmationWindow: !this.state.confirmationWindow })
  }

  onChange = (changes) => {
    this.setState({
      ...changes
    })
  }

  receiveProducts = () => {
    var state = {
      ...this.state,
      _id: this.props.contract._id,
      type: 'receive'
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.shipping.receive', state, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleReceive
          } });
        } if (err) {
          this.setState({ databaseStatus: "failed" });
        }
      });
    })
  }

  render() {
    return (
      <Box
        className="shipping__select"
        closeBox={this.props.toggleReceive}
        title="Realizar Nova Devolução">
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
          toggleConfirmationWindow={this.toggleConfirmationWindow}
          />
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja devolver os produtos?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.receiveProducts}}/>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </Box>
    )
  }
}