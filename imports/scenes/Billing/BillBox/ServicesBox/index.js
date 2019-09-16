import React  from 'react';
import moment from 'moment';

import Input from '/imports/components/Input/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Pdf from '/imports/helpers/Pdf/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class ServicesBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: {},
      status: this.props.charge.status,
      valuePayed: this.props.charge.valuePayed || 0,
      observations: this.props.charge.observations || "",
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  updateBilling = () => {
    var _id = this.props.contract._id;
    var index = this.props.charge.index;
    var type = this.props.charge.type;
    var contract = this.props.contract;
    var billing = [...contract.snapshots[contract.activeVersion][type]];
    var status = this.state.status === "ready" ? "billed" : this.state.status;

    billing[index] = {
      ...billing[index],
      status,
      valuePayed: this.state.valuePayed,
      observations: this.state.observations
    }

    this.setState({ databaseStatus: {status: "loading"} }, () => {
      Meteor.call('contracts.billing.update', _id, billing, type, (err, res) => {
        if (err) this.setState({ databaseStatus: {status: "failed"} });
        if (res) this.setState({ databaseStatus: {status: "completed"} });
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
    switch (this.props.charge.status) {
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
              disabled={this.props.charge.status === "finished"}
              onChange={this.handleChange}
            />
            <Input
              title="Pagamento Quitado"
              type="checkbox"
              id="finished-checkbox"
              name="status"
              readOnly={this.props.charge.status === "finished"}
              value={this.state.status === "finished"}
              onChange={onChange}/>
          </>
        )
      default:
        return <div></div>;
    }
  }
  footerButtons = () => {
    switch (this.props.charge.status) {
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
              {this.props.contract._id}.{this.props.contract.activeVersion}
            </div>
            <div>
              <label>Parcela: </label>
              {this.props.charge.index+1}/{this.props.charge.length}
            </div>
            <div>
              <label>Vencimento: </label>
              {this.props.getFormattedDate("expiry")}
            </div>
            <div>
              <label>Valor Base: </label>
              {tools.format(this.props.charge.value, 'currency')}
            </div>
          </div>
          <div>
            <div>
              <label>Descrição: </label>
              {this.props.charge.description}
            </div>
            <div>
              <label>Conta: </label>
              {this.props.charge.account.description}
            </div>
            <div>
              <label>Status: </label>
              {this.props.renderStatus(this.props.charge.status, 'billingServices')}
            </div>
          </div>
        </div>
        <div className="billing__bill-box__inputs">
          {this.renderInputs()}
          <Input
            title="Observações"
            type="textarea"
            value={this.state.observations}
            name="observations"
            className="grid-span-2"
            disabled={this.props.charge.status === "finished"}
            onChange={this.handleChange}
          />

        </div>
        {this.footerButtons()}
        <DatabaseStatus
          callback={this.props.toggleWindow}
          status={this.state.databaseStatus.status}
          message={this.state.databaseStatus.message}/>
      </div>
    )
  }
}