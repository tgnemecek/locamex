import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import ReceivePacks from './ReceivePacks/index';
import ReceiveSeries from './ReceiveSeries/index';
import ReceiveVariations from './ReceiveVariations/index';
import Footer from './Footer/index';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      packs: [],
      variations: [],

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
      variations: this.state.variations,
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
          currentlyRented={this.props.currentlyRented}
          placesDatabase={this.props.databases.placesDatabase}
        />
        <ReceivePacks
          update={this.update}
          modulesDatabase={this.props.databases.modulesDatabase}
          placesDatabase={this.props.databases.placesDatabase}
          currentlyRented={this.props.currentlyRented}
          StockTransition={this.props.StockTransition}
          ModuleList={this.props.ModuleList}
          packs={this.state.packs}
        />
        <ReceiveVariations
          update={this.update}
          variations={this.state.variations}
          placesDatabase={this.props.databases.placesDatabase}
          currentlyRented={this.props.currentlyRented}/>
        <Footer
          series={this.state.series}
          packs={this.state.packs}
          variations={this.state.variations}
          toggleWindow={this.props.toggleWindow}
          toggleConfirmationWindow={this.toggleConfirmationWindow}
          />
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja devolver os produtos selecionados?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.receiveProducts}}
        />
        <DatabaseStatus status={this.state.databaseStatus} />
      </Box>
    )
  }
}