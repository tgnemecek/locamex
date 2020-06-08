import React from "react";
import moment from "moment";

import tools from "/imports/startup/tools/index";
import Block from "/imports/components/Block/index";
import Input from "/imports/components/Input/index";
import CalendarBar from "/imports/components/CalendarBar/index";
import Box from "/imports/components/Box/index";
import FooterButtons from "/imports/components/FooterButtons/index";

import AccountsSelector from "./AccountsSelector/index";
import EqualCharges from "./EqualCharges/index";
import ProductsSection from "./ProductsSection/index";
import ServicesSection from "./ServicesSection/index";

export default class BillingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingProducts: this.props.snapshot.billingProducts || [],
      billingServices: this.props.snapshot.billingServices || [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    if (this.props.totalValue() <= 0) {
      this.setState({
        errorMsg:
          "O Valor Total do Contrato não pode ser zero. Adicione produtos antes.",
      });
    } else if (!this.props.snapshot.services.length) {
      this.setState({
        errorMsg: "Adicione ao menos um serviço",
      });
    } else {
      this.setBillingProducts();
      this.setBillingServices(1);
    }
  }

  updateBilling = (changes) => {
    this.setState({
      ...this.state,
      ...changes,
    });
  };

  setBillingProducts = () => {
    if (this.state.billingProducts.length) return;

    var dates = this.props.snapshot.dates;
    var duration = this.props.snapshot.dates.duration;
    if (this.props.snapshot.dates.timeUnit === "days") {
      duration = 1;
    }
    var calculation = this.getEqualValues(
      this.props.totalValue("products"),
      duration
    );

    var billingProducts = [];

    // Loop:
    for (var i = 0; i < duration; i++) {
      var value = calculation.equalValue;
      if (i === 0) {
        value += calculation.remainder;
      }
      var startDate = moment(dates.startDate)
        .add(i * 30 + i * 1, "days")
        .toDate();
      var endDate = moment(startDate).add(30, "days").toDate();
      var expiryDate = moment(startDate).add(1, "months").toDate();

      billingProducts.push({
        description: `Parcela ${i + 1} de ${duration} de Locação`,
        value,
        startDate,
        endDate,
        expiryDate,
        account: {},
      });
    }
    this.setState({ billingProducts });
  };

  setBillingServices = (duration) => {
    if (duration === 1 && this.props.snapshot.billingServices.length) {
      return;
    }

    var oldBilling = this.state.billingServices;
    var billingServices = [];
    var calculation = this.getEqualValues(
      this.props.totalValue("services"),
      duration
    );
    for (var i = 0; i < duration; i++) {
      var description = `Parcela ${i + 1} de ${duration} do Pacote de Serviços`;
      var value = calculation.equalValue;
      if (i === 0) {
        value += calculation.remainder;
      }
      if (oldBilling[i]) {
        billingServices.push({
          ...oldBilling[i],
          description,
          value,
        });
      } else {
        var startDate = this.props.snapshot.dates.startDate;
        var inss = 0.11;
        var iss = 0.05;
        var account = {};
        if (i > 0) {
          startDate = billingServices[i - 1].expiryDate;
          inss = billingServices[i - 1].inss;
          iss = billingServices[i - 1].iss;
          account = billingServices[i - 1].account;
        }
        billingServices.push({
          description,
          inss,
          iss,
          account,
          value,
          expiryDate: moment(startDate).add(1, "months").toDate(),
        });
      }
    }
    this.setState({ billingServices });
  };

  getEqualValues = (value, duration) => {
    debugger;
    var equalValue = tools.round(value / duration, 2);
    var remainder = tools.round(value - equalValue * duration, 2);
    return {
      equalValue,
      remainder,
    };
  };

  saveEdits = () => {
    var allBills = this.state.billingProducts.concat(
      this.state.billingServices
    );

    const hasInvalidValue = () => {
      return allBills.every((item) => {
        return item.value <= 0;
      });
    };

    const hasInvalidDifference = () => {
      var total = allBills.reduce((acc, cur) => {
        return (acc = acc + Number(cur.value));
      }, 0);
      total = tools.round(total, 2);
      let target = tools.round(this.props.totalValue(), 2);
      return target - total !== 0;
    };

    const hasInvalidAccount = () => {
      return !allBills.every((item) => {
        return item.account._id;
      });
    };

    if (hasInvalidAccount()) {
      this.setState({ errorMsg: "Favor selecionar a Conta." });
    } else if (hasInvalidValue()) {
      this.setState({ errorMsg: "Não devem haver cobranças com valor zero." });
    } else if (hasInvalidDifference()) {
      this.setState({
        errorMsg:
          "O valor resultante das parcelas não coincide com os Valores Totais.",
      });
    } else if (this.props.totalValue() <= 0) {
      this.setState({
        errorMsg:
          "O Valor Total do Contrato não pode ser zero. Adicione produtos antes.",
      });
    } else {
      this.props.updateSnapshot(
        {
          billingProducts: this.state.billingProducts,
          billingServices: this.state.billingServices,
        },
        this.props.closeWindow
      );
    }
  };

  render() {
    return (
      <Box
        title="Tabela de Cobrança:"
        className="billing-schedule"
        closeBox={this.props.closeWindow}
      >
        <div className="error-message">{this.state.errorMsg}</div>
        <ProductsSection
          disabled={this.props.disabled}
          updateBilling={this.updateBilling}
          billingProducts={this.state.billingProducts}
          productsValue={this.props.totalValue("products")}
          calculation={this.getEqualValues(
            this.props.totalValue("products"),
            this.state.billingProducts.length
          )}
          AccountsSelector={AccountsSelector}
          EqualCharges={EqualCharges}
        />
        <ServicesSection
          disabled={this.props.disabled}
          updateBilling={this.updateBilling}
          billingServices={this.state.billingServices}
          setBilling={this.setBillingServices}
          servicesValue={this.props.totalValue("services")}
          calculation={this.getEqualValues(
            this.props.totalValue("services"),
            this.state.billingServices.length
          )}
          AccountsSelector={AccountsSelector}
          EqualCharges={EqualCharges}
        />
        {!this.props.disabled &&
        this.state.billingProducts[0] &&
        this.state.billingServices[0] ? (
          <FooterButtons
            buttons={[
              {
                text: "Voltar",
                className: "button--secondary",
                onClick: this.props.toggleWindow,
              },
              { text: "Confirmar Edições", onClick: this.saveEdits },
            ]}
          />
        ) : null}
      </Box>
    );
  }
}
