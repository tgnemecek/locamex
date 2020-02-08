import React from 'react';

import DatabaseStatus from '/imports/components/DatabaseStatus/index';

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

import Footer from './Footer/index';

export default class RegisterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: false
    }
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
    switch (this.props.type) {
      case 'accessories':
        return (
          <RegisterAccessories
            {...this.props}
            databaseLoading={this.databaseLoading}
            databaseFailed={this.databaseFailed}
            databaseCompleted={this.databaseCompleted}
            Footer={Footer}
          />
        )
        break;
      case 'accounts':
        return <RegisterAccounts {...this.props} Footer={Footer} />
        break;
      case 'containers':
        return <RegisterContainers {...this.props} Footer={Footer} />
        break;
      case 'clients':
        return <RegisterClients {...this.props} Footer={Footer} />
        break;
      case 'history':
        return <RegisterHistory {...this.props} Footer={Footer} />
        break;
      case 'series':
        return <RegisterSeries {...this.props} Footer={Footer} />
        break;
      case 'modules':
        return <RegisterModules {...this.props} Footer={Footer} />
        break;
      case 'packs':
        return <RegisterPacks {...this.props} Footer={Footer} />
        break;
      case 'places':
        return <RegisterPlaces {...this.props} Footer={Footer} />
        break;
      case 'services':
        return <RegisterServices {...this.props} Footer={Footer} />
        break;
      case 'users':
        return <RegisterUsers {...this.props} Footer={Footer} />
        break;
      default:
        return null;
    }
  }

  render() {
    return (
      <>
        {this.selectComponent()}
        <DatabaseStatus status={this.state.databaseStatus}/>
      </>
    )
  }


}