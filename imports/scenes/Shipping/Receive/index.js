import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import ReceivePacks from './ReceivePacks/index';
import ReceiveSeries from './ReceiveSeries/index';
import ReceiveAccessories from './ReceiveAccessories/index';
import Footer from './Footer/index';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      packs: [],
      accessories: [],

      databaseStatus: '',
      confirmationWindow: false
    }
  }

  update = (changes, callback) => {
    this.setState({
      ...changes
    }, () => {
      if (typeof callback === 'function') {
        callback()
      }
    })
  }

  toggleConfirmationWindow = () => {
    this.setState({
      confirmationWindow: !this.state.confirmationWindow
    });
  }

  receiveProducts = () => {
    var data = {
      contractId: this.props.contract._id,
      series: this.state.series,
      packs: this.state.packs,
      accessories: this.state.accessories,
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.shipping.receive', data, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleReceive
          } });
        } if (err) {
          this.setState({ databaseStatus: {
            status: "failed",
            message: tools.translateError(err)
          }});
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
        <ReceiveSeries
          update={this.update}
          series={this.state.series}
          // snapshot={this.props.snapshot}
          currentlyRented={this.props.currentlyRented}
          // seriesDatabase={this.props.databases.seriesDatabase}
          placesDatabase={this.props.databases.placesDatabase}
        />
        {!this.state.series.length &&
          !this.state.accessories.length &&
          !this.state.packs.length ?
          "Não há itens disponíveis para recebimento!"
        : null}
        <ReceivePacks
          update={this.update}
          // snapshot={this.props.snapshot}
          modulesDatabase={this.props.databases.modulesDatabase}
          // containersDatabase={this.props.databases.containersDatabase}
          // packsDatabase={this.props.databases.packsDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          currentlyRented={this.props.currentlyRented}
          StockTransition={this.props.StockTransition}
          ModuleList={this.props.ModuleList}
          packs={this.state.packs}
        />
        {/* <ReceiveAccessories
          update={this.update}
          snapshot={this.props.snapshot}
          currentlyRented={this.props.currentlyRented}
          accessoriesDatabase={this.props.databases.accessoriesDatabase}
          StockTransition={this.props.StockTransition}
          accessories={this.state.accessories}/>
        <Footer
          hidden={
            !this.state.series.length &&
            !this.state.accessories.length &&
            !this.state.packs.length}
          series={this.state.series}
          packs={this.state.packs}
          accessories={this.state.accessories}
          toggleWindow={this.props.toggleWindow}
          toggleConfirmationWindow={this.toggleConfirmationWindow}
          /> */}
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja enviar os produtos selecionados?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.receiveProducts}}
        />
        <DatabaseStatus status={this.state.databaseStatus} />
      </Box>
    )
  }
}