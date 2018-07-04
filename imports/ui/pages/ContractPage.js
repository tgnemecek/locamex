import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Contracts } from '../../api/contracts';

import PrivateHeader from '../PrivateHeader';
import NotFound from '../NotFound';
import Contract from '../Contract';

export default class ContractPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contract: undefined
    }
  }

  componentDidMount() {
    if (this.props.params.contractId == 'create-new') {
      this.setState({ contract: {
        _id: "",
        clientId: "",
        type: "rent",
        status: "inactive",
        createdBy: "FAZER!!",
        creationDate: "FAZER!!",
        startDate: "",
        duration: "",
        observations: "",
        deliveryAddress: "",
        products: ""
      } });
    } else {
      this.contractsTracker = Tracker.autorun(() => {
        Meteor.subscribe('contractsPub');
        var contract = Contracts.findOne({ _id: this.props.params.contractId });
        this.setState({ contract });
      })
    }
  }

  render () {
    if (this.state.contract) {
      return (
        <div>
          <PrivateHeader title="Contrato"/>
          <div className="page-content">
            <Contract
              _id={this.state.contract._id}
              clientId={this.state.contract.clientId}
              type={this.state.contract.type}
              status={this.state.contract.status}
              createdBy={this.state.contract.createdBy}
              creationDate={this.state.contract.creationDate}
              startDate={this.state.contract.startDate}
              duration={this.state.contract.duration}
              observations={this.state.contract.observations}
              deliveryAddress={this.state.contract.deliveryAddress}
              products={this.state.contract.products}
            />
          </div>
        </div>
      )
    } else return null;
  }
}