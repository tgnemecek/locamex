import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

import SendPacks from './SendPacks/index';
import SendSeries from './SendSeries/index';
import SendAccessories from './SendAccessories/index';
// import Footer from './Footer/index';

export default class Send extends React.Component {
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

  sendProducts = () => {
    var state = {
      ...this.state,
      _id: this.props.contract._id
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.shipping.send', state, (err, res) => {
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleSend
          } });
        } if (err) this.setState({ databaseStatus: "failed"});
      });
    })
  }

  sortSeriesDatabase = () => {
    var seriesDatabase = [...this.props.databases.seriesDatabase];
    return seriesDatabase.sort((a, b) => {
      var comparison = a.place.localeCompare(b.place);
      if (comparison === 0) {
        return a._id.localeCompare(b._id);
      } else return comparison;
    })
  }

  render() {
    return (
      <Box
        className="shipping__select"
        closeBox={this.props.toggleSend}
        title="Realizar Nova Entrega">
        <SendSeries
          update={this.update}
          series={this.state.series}
          snapshot={this.props.snapshot}
          currentlyRented={this.props.currentlyRented}
          seriesDatabase={this.props.databases.seriesDatabase}/>
        {!this.state.series.length &&
          !this.state.accessories.length &&
          !this.state.packs.length ?
          "Não há itens disponíveis para envio!"
        : null}
        <SendPacks
          update={this.update}
          snapshot={this.props.snapshot}
          modulesDatabase={this.props.databases.modulesDatabase}
          containersDatabase={this.props.databases.containersDatabase}
          currentlyRented={this.props.currentlyRented}
          StockTransition={this.props.StockTransition}
          packs={this.state.packs}/>
        {/* <SendAccessories
          update={this.update}
          snapshot={this.props.snapshot}
          currentlyRented={this.props.currentlyRented}
          StockTransition={this.props.StockTransition}
          accessories={this.state.accessories}/> */}
        {/* <Footer
          hidden={
            !this.state.fixed.length &&
            !this.state.accessories.length &&
            !this.state.packs.length}
          fixed={this.state.fixed}
          packs={this.state.packs}
          accessories={this.state.accessories}
          toggleConfirmationWindow={this.toggleConfirmationWindow}
          />
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja enviar os produtos selecionados?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.sendProducts}}
        /> */}
        <DatabaseStatus status={this.state.databaseStatus} />
      </Box>
    )
  }
}