import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';

import { Contracts } from '/imports/api/contracts';

import tools from '/imports/startup/tools/index';

import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Loading from '/imports/components/Loading/index';
import Header from './Header/index';
import Information from './Information/index';
import Items from './Items/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contract: {},
      ready: 0
    }
  }

  componentDidMount() {
    if (this.props.params.contractId == 'create-new') {
    } else {
      this.contractsTracker = Tracker.autorun(() => {
        Meteor.subscribe('contractsPub');
        var contract = Contracts.findOne({ _id: this.props.params.contractId });
        if (contract) {
          this.setState({ contract, ready: 1 });
        } else this.setState({ ready: -1 });
      })
    }
  }

  updateContract = (value, what) => {
    var contract = {...this.state.contract};
    contract[what] = value;
    this.setState({ contract });
  }

  render () {
    if (this.state.ready === 1) {
      return (
        <>
          <AppHeader title="Contrato"/>
            <div className="page-content">
              <div className="contract">
                <Header
                  contract={this.state.contract}
                  updateContract={this.updateContract}
                />
                <div className="contract__body">
                  <Information
                    contract={this.state.contract}
                    updateContract={this.updateContract}
                  />
                  <Items
                    contract={this.state.contract}
                    updateContract={this.updateContract}
                  />
                  <div className="contract__body--bottom">
                    <FooterButtons buttons={[
                      {text: "Salvar Edições", className: "button--secondary", onClick: () => {}},
                      {text: "Ativar Contrato", className: "button--primary", onClick: () => {}},
                    ]}/>
                    <div>
                      <p>Contrato criado dia 12/12/2018</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
      )
    } else if (this.state.ready === 0) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <Loading fullPage={true}/>
          </div>
        </>
      )
    } else if (this.state.ready === -1) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <NotFound/>
          </div>
        </>
      )
    }
  }
}