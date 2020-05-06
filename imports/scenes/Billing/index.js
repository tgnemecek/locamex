import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import MainHeader from '/imports/components/MainHeader/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import Information from './Information/index';
import BillingHistory from './BillingHistory/index';
import BillBox from './BillBox/index';

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billToEdit: false,
      finalizeWindow: false,
      databaseStatus: false
    }
  }

  toggleWindow = (billToEdit) => {
    billToEdit = this.state.billToEdit ? false : billToEdit;
    this.setState({ billToEdit })
  }

  toggleFinalizeWindow = () => {
    this.setState({ finalizeWindow: !this.state.finalizeWindow })
  }

  finalizeMessage = () => {
    var message = "Deseja finalizar este contrato? Ele não poderá ser reativado e todas as cobranças serão finalizadas.";
    var all = this.props.snapshot.billingProducts.concat(
      this.props.snapshot.billingServices,
      this.props.snapshot.billingProrogation
    )
    var verification = all.every((bill) => {
      return bill.status === "finished";
    })
    if (!verification) {
      message = "Ainda existem cobranças não quitadas. "
                + message;
    }
    return message;
  }

  finalizeContract = () => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.finalize', this.props.contract._id,
      (err, res) => {
        if (err) {
          this.setState({ databaseStatus: {
            status: "failed",
            message: tools.translateError(err)
          } })
        }
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.toggleFinalizeWindow
          } })
        }
      })
    })
  }

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="billing"/>
        <div className="main-scene">
          <MainHeader
            createdByName={this.props.snapshot.createdByName}
            title={"Contrato #" + this.props.contract._id}
            status={this.props.contract.status}
            type="billing"
            snapshotIndex={this.props.snapshotIndex}
            snapshots={this.props.contract.snapshots}
          />
          <div className="main-scene__body">
            <Information
              client={this.props.snapshot.client}
              proposalId={this.props.contract.proposalId}
              proposalIndex={this.props.contract.proposalIndex}
            />
            <BillingHistory
              snapshot={this.props.snapshot}
              toggleWindow={this.toggleWindow}
            />
            <FooterButtons
              disabled={this.props.contract.status !== "active"}
              buttons={[
              {
                text: "Finalizar Contrato",
                onClick: this.toggleFinalizeWindow
              }
            ]}/>
            {this.state.billToEdit ?
              <BillBox
                toggleWindow={this.toggleWindow}
                contract={this.props.contract}
                snapshot={this.props.snapshot}
                snapshotIndex={this.props.snapshotIndex}
                bill={this.state.billToEdit}
              />
            : null}
            <ConfirmationWindow
              isOpen={this.state.finalizeWindow}
              closeBox={this.toggleFinalizeWindow}
              message={this.finalizeMessage()}
              leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleFinalizeWindow}}
              rightButton={{text: "Sim", className: "button--danger", onClick: this.finalizeContract}}
            />
            <DatabaseStatus status={this.state.databaseStatus}/>
          </div>
        </div>
      </div>
    )
  }
}

function BillingLoader(props) {
  if (props.contract) {
    return <Billing {...props}/>
  } else return null;
}

export default BillingWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  var snapshot;
  var snapshotIndex;
  if (contract) {
    snapshot = contract.snapshots.find((snapshot, i) => {
      snapshotIndex = i;
      return snapshot.active;
    })

    snapshot.billingProrogation = tools.prepareProrogation(
      snapshot, contract.status);

    snapshot.billingProrogation = snapshot.billingProrogation.map((bill) => {
      return {
        ...bill,
        type: "billingProrogation",
        status: tools.getBillStatus(bill)
      }
    })
    snapshot.billingProducts = snapshot.billingProducts.map((bill) => {
      return {
        ...bill,
        status: tools.getBillStatus(bill),
        type: "billingProducts"
      }
    })
    snapshot.billingServices = snapshot.billingServices.map((bill) => {
      return {
        ...bill,
        status: tools.getBillStatus(bill),
        type: "billingServices"
      }
    })
  }

  return {
    contract,
    snapshot,
    snapshotIndex
  }

})(BillingLoader);