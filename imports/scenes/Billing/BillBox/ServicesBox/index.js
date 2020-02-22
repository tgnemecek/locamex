import React  from 'react';
import moment from 'moment';

import Input from '/imports/components/Input/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class ServicesBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: '',
      status: this.props.bill.status,
      valuePayed: this.props.bill.valuePayed || 0,
      annotations: this.props.bill.annotations || "",
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  updateBilling = () => {
    var _id = this.props.contract._id;
    var bill = {
      ...this.props.bill,
      status: this.state.status,
      valuePayed: this.state.valuePayed,
      annotations: this.state.annotations,
    }

    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.billing.update', _id, bill, (err, res) => {
        if (err) this.setState({ databaseStatus: "failed" });
        if (res) this.setState({ databaseStatus: {
          status: "completed",
          callback: this.props.toggleWindow
        } });
      })
    });
  }
  renderInputs = () => {
    const onChange = (e) => {
      var bool = e.target.value;
      if (bool) {
        this.setState({ status: "finished" });
      } else this.setState({ status: "billed" });
    }
    switch (this.props.bill.status) {
      case "finished":
      case "billed":
      case "late":
        return (
          <>
            <Input
              title="Valor Pago"
              type="currency"
              value={this.state.valuePayed}
              name="valuePayed"
              disabled={this.props.bill.status === "finished"}
              onChange={this.handleChange}
            />
            <Input
              title="Pagamento Quitado"
              type="checkbox"
              id="finished-checkbox"
              name="status"
              readOnly={this.props.bill.status === "finished"}
              value={this.state.status === "finished"}
              onChange={onChange}/>
          </>
        )
      default:
        return <div></div>;
    }
  }
  footerButtons = () => {
    switch (this.props.bill.status) {
      case "late":
      case "billed":
        return (
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar Edições", className: "button--primary", onClick: this.updateBilling},
          ]}/>
        )
      case "finished":
        return (
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow}
          ]}/>
        )
      case "ready":
        return (
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Nota Fiscal Enviada", className: "button--primary", onClick: this.updateBilling},
          ]}/>
        )
    }
  }
  render() {
    return (
      <div>
        <div className="billing__bill-box__body">
          <div>
            <div>
              <label>Contrato: </label>
              {this.props.contract._id}.{this.props.snapshotIndex+1}
            </div>
            <div>
              <label>Parcela: </label>
              {this.props.bill.index+1}/{this.props.bill.length}
            </div>
            <div>
              <label>Vencimento: </label>
              {this.props.getFormattedDate("expiry")}
            </div>
            <div>
              <label>Valor Base: </label>
              {tools.format(this.props.bill.value, 'currency')}
            </div>
          </div>
          <div>
            <div>
              <label>Descrição: </label>
              {this.props.bill.description}
            </div>
            <div>
              <label>Conta: </label>
              {this.props.bill.account.description}
            </div>
            <div>
              <label>Status: </label>
              {this.props.translateBillStatus(this.props.bill.status, 'billingServices').text}
            </div>
          </div>
        </div>
        <div className="billing__bill-box__inputs">
          {this.renderInputs()}
          <Input
            title="Anotações: (Controle Interno)"
            type="textarea"
            value={this.state.annotations}
            name="annotations"
            className="grid-span-2"
            onChange={this.handleChange}
          />
        </div>
        {this.footerButtons()}
        <DatabaseStatus
          callback={this.props.toggleWindow}
          status={this.state.databaseStatus}/>
      </div>
    )
  }
}