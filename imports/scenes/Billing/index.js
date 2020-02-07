import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Accounts } from '/imports/api/accounts/index';
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

  getAccount = (accountId) => {
    return this.props.databases.accountsDatabase.find((item) => {
      return item._id === accountId;
    }) || {};
  }

  renderStatus = (status, type) => {
    var obj = tools.renderBillingStatus(status, type);
    return (
      <span className={obj.className}>
        {obj.text}
      </span>
    )
  }

  renderProductsBody = () => {
    return this.props.contract.billingProducts.map(
      (charge, i, arr) => {

      var status = tools.getBillingStatus(charge);
      var account = this.getAccount(charge.accountId);

      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingProducts",
          status: tools.getBillingStatus(charge),
          account
        } });
      }

      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{account.description}</td>
          <td className="table__small-column">
            {moment(charge.startDate).format("DD/MM/YYYY") + " a " +
            moment(charge.endDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {moment(charge.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(charge.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(charge.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">{charge._id || ""}</td>
          <td className="table__small-column">
            {this.renderStatus(status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="table__small-column table__td-button">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  renderProrogationBody = () => {

    function conditionalPush(contract) {
      var lastCharge;
      var billingProducts = contract.billingProducts;
      var billingProrogation = contract.billingProrogation || [];
      var today = moment();

      // First we find out what is the lastCharge
      if (billingProrogation.length) {
        // If there is already a prorogation, the lastCharge is in it
        var lastIndex = billingProrogation.length-1;
        lastCharge = billingProrogation[lastIndex]
      } else {
        // If not, the lastCharge is in the regular billing
        // But first we need to know if there is prorogation at all
        var lastIndex = billingProducts.length-1;
        var lastRegularCharge = billingProducts[lastIndex];
        if (moment(lastRegularCharge.expiryDate).isBefore(today)) {
          // If today has past the last charge, there is a push
          lastCharge = lastRegularCharge;
        } else return billingProrogation;
      }
      // From this point, we are certain a new push is needed
      // Then we find out if the lastCharge date has passed
      var lastExpiry = moment(lastCharge.expiryDate);
      var lastEnd = moment(lastCharge.endDate);
      if (lastExpiry.isBefore(today)) {

        var expiryDate = lastExpiry.add(1, 'months').toDate();
        var startDate = lastEnd.add(1, 'days').toDate();
        var endDate = moment(startDate).add(30, 'days').toDate();

        var newCharge = {
          startDate,
          endDate,
          expiryDate
        }

        newCharge = {
          ...newCharge,
          status: tools.getBillingStatus(newCharge),
          value: lastCharge.value,
          valuePayed: 0,
          accountId: lastCharge.accountId,
          description: `Prorrogação Automática #${billingProrogation.length+1}`
        }

        return [
          ...billingProrogation,
          newCharge
        ]
      } else return billingProrogation;
    }

    var billingProrogation = conditionalPush(this.props.contract);

    return billingProrogation.map((charge, i, arr) => {
      var status = tools.getBillingStatus(charge);
      var account = this.getAccount(charge.accountId);

      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingProrogation",
          status: tools.getBillingStatus(charge),
          account
        } });
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{"PRO #" + (i+1)}</td>
          <td>{account.description}</td>
          <td className="table__small-column">
            {moment(charge.startDate).format("DD/MM/YYYY") + " a " +
            moment(charge.endDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {moment(charge.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(charge.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(charge.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">{charge._id || ""}</td>
          <td className="table__small-column">
            {this.renderStatus(status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="table__small-column table__td-button">
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
      var status = tools.getBillingStatus(charge);
      var account = this.getAccount(charge.accountId);

      const toggleBox = () => {
        this.setState({ billBox: {
          ...charge,
          index: i,
          length: arr.length,
          type: "billingServices",
          status: tools.getBillingStatus(charge),
          account
        } });
      }

      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{account.description}</td>
          <td className="table__small-column">
            {moment(charge.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(charge.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(charge.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">
            {this.renderStatus(status, 'billingServices')}
          </td>
          {status === "ready" || status === "late" || status === "billed" ?
            <td className="table__small-column table__td-button">
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
        <div className="main-scene billing">
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
          <h3>Informações</h3>
          <div className="billing__information">
            <Input
              title="Cliente"
              readOnly={true}
              value={this.props.contract.client.description}
            />
            <Input
              title="Proposta"
              readOnly={true}
              value={this.props.contract.proposal + "." + (this.props.contract.proposalVersion+1)}
            />
          </div>
          <h3>Histórico de Faturas</h3>
          <h4>Cobranças de Locação</h4>
          <table className="table">
            <thead>
              <tr>
                <th className="table__small-column">#</th>
                <th>Conta</th>
                <th className="table__small-column">Período</th>
                <th className="table__small-column">Vencimento</th>
                <th className="table__small-column">Valor Base</th>
                <th className="table__small-column">Valor Pago</th>
                <th className="table__small-column">Número da Fatura</th>
                <th className="table__small-column">Status</th>
              </tr>
            </thead>
            <tbody>
              {this.renderProductsBody()}
              {this.renderProrogationBody()}
            </tbody>
          </table>
          {this.props.contract.billingServices.length ?
            <>
              <h4>Cobranças de Serviço</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th className="table__small-column">#</th>
                    <th>Conta</th>
                    <th className="table__small-column">Vencimento</th>
                    <th className="table__small-column">Valor Base</th>
                    <th className="table__small-column">Valor Pago</th>
                    <th className="table__small-column">Status</th>
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
              toggleWindow={() => this.setState({ billBox: false })}
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
  Meteor.subscribe('accountsPub');

  var databases = {
    usersDatabase: Meteor.users.find().fetch(),
    clientsDatabase: Clients.find().fetch(),
    accountsDatabase: Accounts.find().fetch(),
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
    contract.client = databases.clientsDatabase.find((client) => {
      return client._id === contract.clientId;
    }) || {}
  }

  return { contract, databases }

})(BillingLoader);