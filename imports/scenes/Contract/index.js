import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';

import { Contracts } from '/imports/api/contracts';

import customTypes from '/imports/startup/custom-types';

import PrivateHeader from '/imports/components/PrivateHeader/index';
import Header from './Header/index';
import Information from './Information/index';
import Items from './Items/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contract: {},
      _id: '',
      ready: false
    }
  }

  componentDidMount() {
    if (this.props.params.contractId == 'create-new') {
    } else {
      this.contractsTracker = Tracker.autorun(() => {
        Meteor.subscribe('contractsPub');
        var contract = Contracts.findOne({ _id: this.props.params.contractId });
        if (contract) {
          contract = customTypes.deepCopy(contract);
          var _id = contract._id
          this.setState({ contract, _id, ready: true });
        } else this.setState({ ready: false });
      })
    }
  }

  render () {
    if (this.state.ready) {
      return (
        <div>
          <PrivateHeader title="Contrato"/>
          <form className="contract">
            <Header contract={this.state.contract}/>
            <div className="contract__body">
              <Information contract={this.state.contract}/>
              <Items contract={this.state.contract}/>
              <div className="contract__body--bottom">
                <FooterButtons buttons={[
                  {text: "Salvar Edições", className: "button--secondary", onClick: console.log('a')},
                  {text: "Ativar Contrato", className: "button--primary", onClick: console.log('b')},
                ]}/>
                <div>
                  <p>Contrato criado dia 12/12/2018</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    } else return null;
  }
}