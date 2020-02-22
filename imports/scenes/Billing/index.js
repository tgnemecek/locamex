import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
// import { Accounts } from '/imports/api/accounts/index';
// import { Clients } from '/imports/api/clients/index';
// import { Containers } from '/imports/api/containers/index';
// import { Accessories } from '/imports/api/accessories/index';
// import { Services } from '/imports/api/services/index';
// import SceneHeader from '/imports/components/SceneHeader/index';
import MainHeader from '/imports/components/MainHeader/index';

import Information from './Information/index';
import BillingHistory from './BillingHistory/index';
import BillBox from './BillBox/index';

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billToEdit: false
    }
  }

  translateBillStatus = (status, type) => {
    var dictionary = {
      notReady: {text: "Em Aguardo", className: "billing__notReady"},
      late: {text: "Pagamento Atrasado", className: "billing__late"},
      finished: {text: "Pagamento Quitado", className: "billing__finished"}
    };
    if (type === 'billingServices') {
      dictionary = {
        ...dictionary,
        billed: {text: "NFE Enviada", className: "billing__billed"},
        ready: {text: "Enviar NFE", className: "billing__ready"}
      }
    } else {
      dictionary = {
        ...dictionary,
        billed: {text: "Fatura Gerada", className: "billing__billed"},
        ready: {text: "Fatura Pronta", className: "billing__ready"}
      }
    }
    return dictionary[status];
  }

  toggleWindow = (billToEdit) => {
    billToEdit = this.state.billToEdit ? false : billToEdit;
    this.setState({ billToEdit })
  }

  render() {
    console.log(this.props.snapshot.billingProrogation)
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
              translateBillStatus={this.translateBillStatus}
              toggleWindow={this.toggleWindow}
            />
            {this.state.billToEdit ?
              <BillBox
                toggleWindow={this.toggleWindow}
                translateBillStatus={this.translateBillStatus}
                contract={this.props.contract}
                snapshot={this.props.snapshot}
                snapshotIndex={this.props.snapshotIndex}
                bill={this.state.billToEdit}
              />
            : null}
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
    function getBillStatus (bill) {
      if (bill.status === "finished") {
        return bill.status;
      }
      var limit = moment().add(30, 'days');
      // Determine if is ready to be payed
      if (moment(bill.expiryDate).isBetween(moment(), limit)) {
        return bill.status === "billed" ? "billed" : "ready";
      }
      // Determine if is late
      // If its late, but client hasn't been billed,
      // show as ready to be billed
      if (moment(bill.expiryDate).isBefore(moment())) {
        return bill.status === "billed" ? "late" : "ready";
      }
      return "notReady";
    }
    function prepareProrogation(snapshot) {
      // Checking and preparing billingProrogation
      var lastBill;
      var billingProducts = snapshot.billingProducts;
      var billingProrogation = snapshot.billingProrogation;
      var today = moment();
      // First we find out what is the lastBill
      if (billingProrogation.length) {
        // If there is already a prorogation, the lastBill is in it
        var lastIndex = billingProrogation.length-1;
        lastBill = billingProrogation[lastIndex]
      } else {
        // If not, the lastBill is in the regular billing
        // But first we need to know if there is prorogation at all
        var lastIndex = billingProducts.length-1;
        var lastRegularBill = billingProducts[lastIndex];
        if (moment(lastRegularBill.expiryDate).isBefore(today)) {
          // If today has past the last bill, there is a push
          lastBill = lastRegularBill;
        } else return billingProrogation;
      }
      // From this point, we are certain a new push is needed
      // Then we find out if the lastBill date has passed
      var lastExpiry = moment(lastBill.expiryDate);
      var lastEnd = moment(lastBill.endDate);
      if (lastExpiry.isBefore(today)) {

        var expiryDate = lastExpiry.add(1, 'months').toDate();
        var startDate = lastEnd.add(1, 'days').toDate();
        var endDate = moment(startDate).add(30, 'days').toDate();

        var newBill = {
          startDate,
          endDate,
          expiryDate
        }

        newBill = {
          ...newBill,
          value: lastBill.value,
          valuePayed: 0,
          account: lastBill.account,
          description: `Prorrogação Automática #${billingProrogation.length+1}`
        }
        return [...billingProrogation, newBill]
      }
      return billingProrogation
    }

    snapshot.billingProrogation = prepareProrogation(snapshot);
    snapshot.billingProrogation = snapshot.billingProrogation.map((bill) => {
      return {
        ...bill,
        type: "billingProrogation",
        status: getBillStatus(bill)
      }
    })
    snapshot.billingProducts = snapshot.billingProducts.map((bill) => {
      return {
        ...bill,
        status: getBillStatus(bill),
        type: "billingProducts"
      }
    })
    snapshot.billingServices = snapshot.billingServices.map((bill) => {
      return {
        ...bill,
        status: getBillStatus(bill),
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