import React from "react";
import moment from "moment";

import Input from "/imports/components/Input/index";
import tools from "/imports/startup/tools/index";
import Icon from "/imports/components/Icon/index";
import FooterButtons from "/imports/components/FooterButtons/index";
import DatabaseStatus from "/imports/components/DatabaseStatus/index";

export default class ProductsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: "",
      payedInFull: this.props.bill.status === "finished",
      valuePayed: this.props.bill.valuePayed || 0,
      observations: this.props.bill.observations || "",
      annotations: this.props.bill.annotations || "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  updateBilling = () => {
    var _id = this.props.contract._id;
    var bill = {
      ...this.props.bill,
      payedInFull: this.state.payedInFull,
      valuePayed: this.state.valuePayed,
      observations: this.state.observations,
      annotations: this.state.annotations,
    };

    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call("contracts.billing.update", _id, bill, (err, res) => {
        if (err) this.setState({ databaseStatus: "failed" });
        if (res) {
          if (this.props.bill.status === "ready") {
            this.printBilling(
              "",
              {
                ...res,
                index: this.props.bill.index,
                length: this.props.bill.length,
              },
              this.props.toggleWindow
            );
          } else
            this.setState({
              databaseStatus: {
                status: "completed",
                callback: this.props.toggleWindow,
              },
            });
        }
      });
    });
  };
  printBilling = (e, bill, callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      var props = {
        contract: this.props.contract,
        snapshot: this.props.snapshot,
        type: "billing",
        bill: bill || this.props.bill,
      };

      Meteor.call("pdf.generate", props, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          var databaseStatus = {
            status: "completed",
            callback: typeof callback === "function" ? callback : null,
          };
          this.setState({ databaseStatus });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      });
    });
  };
  renderInputs = () => {
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
              name="payedInFull"
              readOnly={this.props.bill.status === "finished"}
              value={this.state.payedInFull}
              onChange={this.handleChange}
            />
          </>
        );
      default:
        return <div></div>;
    }
  };
  footerButtons = () => {
    switch (this.props.bill.status) {
      case "late":
      case "billed":
      case "finished":
        return (
          <FooterButtons
            buttons={[
              {
                text: "Baixar Fatura",
                className: "button--pill",
                onClick: this.printBilling,
              },
              {
                text: "Voltar",
                className: "button--secondary",
                onClick: this.props.toggleWindow,
              },
              {
                text: "Salvar Edições",
                className: "button--primary",
                onClick: this.updateBilling,
              },
            ]}
          />
        );
      case "ready":
        return (
          <FooterButtons
            buttons={[
              {
                text: "Voltar",
                className: "button--secondary",
                onClick: this.props.toggleWindow,
              },
              {
                text: "Gerar Fatura",
                className: "button--primary",
                onClick: this.updateBilling,
              },
            ]}
          />
        );
    }
  };
  render() {
    return (
      <div>
        <div className="billing__bill-box__body">
          <div>
            <div>
              <label>Contrato: </label>
              {this.props.contract._id}.{this.props.snapshotIndex + 1}
            </div>
            {this.props.bill.type === "billingProrogation" ? null : (
              <div>
                <label>Parcela: </label>
                {this.props.bill.index + 1}/{this.props.bill.length}
              </div>
            )}
            <div>
              <label>Período: </label>
              {this.props.getFormattedDate("period")}
            </div>
            <div>
              <label>Vencimento: </label>
              {this.props.getFormattedDate("expiry")}
            </div>
            <div>
              <label>Valor Base: </label>
              {tools.format(this.props.bill.value, "currency")}
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
              {
                tools.translateBillStatus(
                  this.props.bill.status,
                  "billingProducts"
                ).text
              }
            </div>
          </div>
        </div>
        <div className="billing__bill-box__inputs">
          {this.renderInputs()}
          <Input
            title="Observações: (Impresso na Fatura)"
            type="textarea"
            value={this.state.observations}
            name="observations"
            className="grid-span-2"
            disabled={this.props.bill.status !== "ready"}
            onChange={this.handleChange}
          />
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
          status={this.state.databaseStatus}
        />
      </div>
    );
  }
}
