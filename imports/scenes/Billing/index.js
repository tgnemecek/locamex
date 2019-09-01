import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Clients } from '/imports/api/clients/index';

import SceneHeader from '/imports/components/SceneHeader/index';
import BillBox from './BillBox/index';

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billBox: false
    }
  }

  translateStatus = (status) => {
    var dictionary = {
      payed: "Fatura Paga",
      billed: "Fatura Gerada",
      ready: "Fatura Pronta",
      late: "Fatura Atrasada",
      notReady: "Fatura Pendente"
    }
    return dictionary[status];
  }

  chargeStatus = (charge) => {
    if (charge.status === "payed" || charge.status === "billed") {
      return charge.status;
    }
    var limit = moment().add(30, 'days');

    // Determine if is ready to be payed
    if (moment(charge.expiryDate).isBetween(moment(), limit)) {
      return "ready";
    }

    // Determine if is late
    if (moment(charge.expiryDate).isBefore(moment())) {
      return "late";
    }

    return "notReady";
  }

  renderProductsBody = () => {
    return this.props.contract.billingProducts.map((charge, i, arr) => {
      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingProducts"
        } });
      }
      var status = this.chargeStatus(charge);
      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{charge.description}</td>
          <td className="table__small-column">{
            moment(charge.startDate).format("DD/MM/YYYY") + " a " + moment(charge.endDate).format("DD/MM/YYYY")
          }</td>
          <td className="table__small-column">{moment(charge.expiryDate).format("DD/MM/YYYY")}</td>
          <td className="table__small-column">{tools.format(charge.value, 'currency')}</td>
          <td className="table__small-column">{this.translateStatus(status)}</td>
          {status === "ready" || status === "late" ?
            <td className="table__small-column">
              <button onClick={toggleBox}>
                <Icon icon="invoice"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  renderServicesBody = () => {
    return this.props.contract.billingServices.map((charge, i, arr) => {
      var status = this.chargeStatus(charge);
      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{charge.description}</td>
          <td className="table__small-column">{moment(charge.expiryDate).format("DD/MM/YYYY")}</td>
          <td className="table__small-column">{tools.format(charge.value, 'currency')}</td>
          <td className="table__small-column">{this.translateStatus(status)}</td>
          {status === "ready" || status === "late" ?
            <td className="table__small-column">
              <button>
                <Icon icon="invoice"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="billing"/>
        <div className="billing">
          <SceneHeader
            master={{...this.props.contract, type: "billing"}}
            databases={this.props.databases}
            snapshots={this.props.contract ? this.props.contract.snapshots : []}

            updateMaster={this.updateContract}
            cancelMaster={this.cancelContract}
            saveMaster={this.saveEdits}

            errorKeys={[]}
            disabled={true}
          />
          <h3 style={{textAlign: "center", margin: "20px"}}>Cobranças</h3>
          <h4>Cobranças de Locação</h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Descrição</th>
                <th>Período</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.renderProductsBody()}
            </tbody>
          </table>
          {this.props.contract.billingServices.length ?
            <>
              <h4>Cobranças de Serviço</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Descrição</th>
                    <th>Vencimento</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderServicesBody()}
                </tbody>
              </table>
            </>
          : null}
          {this.state.billBox ?
            <BillBox
              contract={this.props.contract}
              charge={this.state.billBox}
              databases={this.props.databases}
            />
          : null}
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
  Meteor.subscribe('usersPub');
  Meteor.subscribe('clientsPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  if (contract) {
    contract = {
      ...contract,
      ...contract.snapshots[contract.activeVersion]
    }
  }

  var databases = {
    usersDatabase: Meteor.users.find().fetch(),
    clientsDatabase: Clients.find().fetch(),
  }

  return { contract, databases }

})(BillingLoader);