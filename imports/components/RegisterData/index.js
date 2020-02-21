import React from 'react';

import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import tools from '/imports/startup/tools/index';

import RegisterAccessories from './RegisterAccessories/index';
import RegisterAccounts from './RegisterAccounts/index';
import RegisterClients from './RegisterClients/index';
import RegisterContainers from './RegisterContainers/index';
import RegisterHistory from './RegisterHistory/index';
import RegisterModules from './RegisterModules/index';
import RegisterPacks from './RegisterPacks/index';
import RegisterPlaces from './RegisterPlaces/index';
import RegisterServices from './RegisterServices/index';
import RegisterSeries from './RegisterSeries/index';
import RegisterUsers from './RegisterUsers/index';

export default class RegisterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: false,
      confirmationWindow: false
    }
    this.confirmationOptions = {};
    this.confirm;
  }

  toggleConfirmationWindow = (confirm, options) => {
    this.confirm = confirm;
    this.confirmationOptions = options || {};
    this.setState({
      confirmationWindow: !this.state.confirmationWindow
    })
  }

  databaseLoading = () => {
    this.setState({ databaseStatus: "loading" })
  }

  databaseFailed = (err) => {
    this.setState({ databaseStatus: {
      status: "failed",
      message: tools.translateError(err)
    } })
  }

  databaseCompleted = () => {
    this.setState({ databaseStatus: {
      status: "completed",
      callback: this.props.toggleWindow
    } })
  }

  selectComponent = () => {
    var Component;
    switch (this.props.type) {
      case 'accessories':
        Component = RegisterAccessories;
        break;
      case 'accounts':
        Component = RegisterAccounts;
        break;
      case 'containers':
        Component = RegisterContainers;
        break;
      case 'clients':
        Component = RegisterClients;
        break;
      case 'history':
        Component = RegisterHistory;
        break;
      case 'series':
        Component = RegisterSeries;
        break;
      case 'modules':
        Component = RegisterModules;
        break;
      case 'pack':
      case 'packs':
        Component = RegisterPacks;
        break;
      case 'places':
        Component = RegisterPlaces;
        break;
      case 'services':
        Component = RegisterServices;
        break;
      case 'users':
        Component = RegisterUsers;
        break;
      default:
        return null;
    }
    return (
      <Component
        {...this.props}
        databaseLoading={this.databaseLoading}
        databaseFailed={this.databaseFailed}
        databaseCompleted={this.databaseCompleted}
        toggleConfirmationWindow={this.toggleConfirmationWindow}
      />
    )
  }

  render() {
    return (
      <>
        {this.selectComponent()}
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          message={this.confirmationOptions.message
            || "Deseja mesmo excluir este item do banco de dados?"}
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.confirm}}
          closeBox={this.toggleConfirmationWindow}/>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </>
    )
  }


}