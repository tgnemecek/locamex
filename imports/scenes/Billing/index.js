import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Services } from '/imports/api/services/index';

import SceneHeader from '/imports/components/SceneHeader/index';
import BillBox from './BillBox/index';

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billBox: false
    }
  }

  renderStatus = (status) => {
    var dictionary = {
      payed: {text: "Fatura Paga", className: "billing__payed"},
      billed: {text: "Fatura Gerada", className: "billing__billed"},
      ready: {text: "Fatura Pronta", className: "billing__ready"},
      late: {text: "Fatura Atrasada", className: "billing__late"},
      notReady: {text: "Fatura Pendente", className: "billing__notReady"}
    }
    var current = dictionary[status]
    return (
      <span className={current.className}>
        {current.text}
      </span>
    )
  }

  billStatus = (charge) => {
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
    debugger;
    return this.props.contract.billingProducts.map((charge, i, arr) => {
      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingProducts",
          status: this.billStatus(charge)
        } });
      }
      var status = this.billStatus(charge);
      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{charge.description}</td>
          <td className="table__small-column">{
            moment(charge.startDate).format("DD/MM/YYYY") + " a " + moment(charge.endDate).format("DD/MM/YYYY")
          }</td>
          <td className="table__small-column">{moment(charge.expiryDate).format("DD/MM/YYYY")}</td>
          <td className="table__small-column">{tools.format(charge.value, 'currency')}</td>
          <td className="table__small-column">{this.renderStatus(status)}</td>
          {true ?
          // {status === "ready" || status === "late" ?
            <td className="table__small-column">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  renderServicesBody = () => {
    return this.props.contract.billingServices.map((charge, i, arr) => {
      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingServices"
        } });
      }
      var status = this.billStatus(charge);
      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{charge.description}</td>
          <td className="table__small-column">{moment(charge.expiryDate).format("DD/MM/YYYY")}</td>
          <td className="table__small-column">{tools.format(charge.value, 'currency')}</td>
          <td className="table__small-column">{this.renderStatus(status)}</td>
          {status === "ready" || status === "late" ?
            <td className="table__small-column">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
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
          <h3 style={{textAlign: "center", margin: "20px"}}>Histórico de Faturas</h3>
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
              closeBox={() => this.setState({ billBox: false })}
              renderStatus={this.renderStatus}
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
  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');

  var databases = {
    usersDatabase: Meteor.users.find().fetch(),
    clientsDatabase: Clients.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch()
  }

  const getDescription = (arr, database) => {
    return arr.map((item) => {
      var product = databases[database].find((product) => product._id === item.productId);
      return {
        ...item,
        description: product ? product.description : ""
      }
    })
  }

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  if (contract) {
    contract = {
      ...contract,
      ...contract.snapshots[contract.activeVersion]
    }
    contract.containers = getDescription(contract.containers, 'containersDatabase');
    contract.accessories = getDescription(contract.accessories, 'accessoriesDatabase');
    contract.services = getDescription(contract.services, 'servicesDatabase');
  }

  return { contract, databases }

})(BillingLoader);