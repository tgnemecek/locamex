import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import CalendarBar from '/imports/components/CalendarBar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import AccountsSelector from './AccountsSelector/index';
import EqualCharges from './EqualCharges/index';
import ProductsSection from './ProductsSection/index';
import ServicesSection from './ServicesSection/index';

export default class BillingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingProducts: [],
      billingServices: [],

      productsValue: 0,
      servicesValue: 0,

      duration: 1,

      errorMsg: ''
    }

    var duration = this.props.master.dates.timeUnit === "months" ? this.props.master.dates.duration : 1;
    var discount = this.props.master.discount;

    var containers = this.props.master.containers || [];
    var accessories = this.props.master.accessories || [];
    var products = containers.concat(accessories);
    var productsValue = calcTotalValue(products, duration) * (1 - discount);

    var services = this.props.master.services || [];
    var servicesValue = calcTotalValue(services, 1);

    function calcTotalValue (arr, duration) {
      if (arr.length == 0) return 0;
      return arr.reduce((acc, current) => {
        var renting = current.renting ? current.renting : 1;
        return acc + (current.price * renting * duration)
      }, 0);
    }
    this.state = {
      ...this.state,
      productsValue,
      servicesValue,
      duration
    };
  }

  componentDidMount() {
    var masterValue = this.state.productsValue + this.state.servicesValue;
    if (masterValue <= 0) {
      this.setState({ errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.' });
    } else {
      this.setBillingProducts();
      var hasServices = this.props.master.services.length > 0;
      this.setBillingServices(hasServices ? 1 : 0, true);
    }
  }

  updateBilling = (changes) => {
    this.setState({
      ...this.state,
      ...changes
    });
  }

  setBillingProducts = () => {
    if (this.props.master.billingProducts) {
      if (this.props.master.billingProducts.length) {
        this.setState({ billingProducts: this.props.master.billingProducts });
        return;
      }
    }
    var billingProducts = [];
    for (var i = 0; i < this.state.duration; i++) {
      billingProducts.push({
        description: `Parcela ${i + 1} de ${this.state.duration} de Locação`,
        value: 0
      })
    }
    billingProducts = this.setEqualValues(billingProducts, "billingProducts");

    function changeStartDate(billingProducts, date) {
      return billingProducts.map((charge, i) => {
        var startDate = moment(date).add((i * 30 + (i * 1)), 'days').toDate();
        var endDate = moment(startDate).add(30, 'days').toDate();
        var expiryDate = moment(startDate).add(1, "months").toDate();
        return {
          ...charge,
          startDate,
          endDate,
          expiryDate
        }
      })
    }
    billingProducts = changeStartDate(
      billingProducts, this.props.master.dates.startDate
    )
    this.setState({ billingProducts });
  }

  setBillingServices = (quantity, firstSetup) => {
    function getDescription(i, length) {
      return `Parcela ${i + 1} de ${length} do Pacote de Serviços`
    }
    if (firstSetup) {
      if (!quantity) return;
      if (this.props.master.billingServices) {
        if (this.props.master.billingServices.length) {
          this.setState({
            billingServices: this.props.master.billingServices
          });
          return;
        }
      }
      var billingServices = [
        {
          expiryDate: moment(this.props.master.dates.startDate)
                      .add(1, 'months').toDate(),
          inss: 11,
          iss: 5,
          description: getDescription(0, 1),
          value: 0
        }
      ]
    } else {
      var currentCharges = this.state.billingServices;
      var billingServices = [];
      for (var i = 0; i < quantity; i++) {
        if (currentCharges[i]) {
          billingServices.push({
            ...currentCharges[i],
            description: getDescription(i, quantity)
          });
        } else {

          var expiryDate = moment(billingServices[i-1].expiryDate)
                          .add(1, 'months').toDate();
          var inss = currentCharges[0].inss;
          var iss = currentCharges[0].iss;

          billingServices.push({
            expiryDate,
            inss,
            iss,
            description: getDescription(i, quantity),
            value: 0,
            accountId: currentCharges[0].accountId
          })
        }
      }
    }
    billingServices = this.setEqualValues(billingServices, "billingServices");
    this.setState({ billingServices });
  }

  // changeStartDate = (date) => {
  //   var billingProducts = [...this.state.billingProducts];
  //   var billingProducts = this.state.billingProducts.map((charge, i) => {
  //     var startDate = moment(date).add((i * 30 + (i * 1)), 'days').toDate();
  //     var endDate = moment(startDate).add(30, 'days').toDate();
  //     var expiryDate = moment(startDate).add(1, "months").toDate();
  //     return {
  //       ...charge,
  //       startDate,
  //       endDate,
  //       expiryDate
  //     }
  //   })
  //   this.setState({ billingProducts });
  // }

  setEqualValues = (charges, which) => {
    var value = which === "billingProducts" ? this.state.productsValue : this.state.servicesValue;
    var equalValue = tools.round(value / charges.length, 2);
    var rest = tools.round(value - (equalValue * charges.length), 2);
    return charges.map((charge, i) => {
      if (i == 0) {
        charge.value = (equalValue + rest);
      } else charge.value = equalValue;
      return charge;
    })
  }

  saveEdits = () => {
    var masterValue = this.state.productsValue + this.state.servicesValue;
    var allCharges = this.state.billingProducts
                    .concat(this.state.billingServices);

    const hasInvalidValue = () => {
      for (var i = 0; i < allCharges.length; i++) {
        if (allCharges[i].value <= 0) {
          return true;
        }
      }
      return false;
    }

    const hasInvalidDifference = () => {
      var total = allCharges.reduce((acc, cur) => {
        return acc = acc + Number(cur.value);
      }, 0);
      total = tools.round(total, 2);
      return masterValue - total !== 0;
    }

    const hasInvalidAccount = () => {
      if (!this.state.billingProducts[0].accountId) {
        return true;
      } else if (this.state.billingServices.length) {
        return !this.state.billingServices[0].accountId;
      }
      return false;
    }

    if (hasInvalidAccount()) {
      this.setState({ errorMsg: 'Favor selecionar a Conta.' });
    } else if (hasInvalidValue()) {
      this.setState({ errorMsg: 'Não devem haver cobranças com valor zero.' });
    } else if (hasInvalidDifference()) {
      this.setState({ errorMsg: 'O valor resultante das parcelas não coincide com os Valores Totais.' });
    } else if (masterValue <= 0) {
      this.setState({ errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.' });
    } else {
      this.props.updateMaster({
        billingProducts: this.state.billingProducts,
        billingServices: this.state.billingServices
      });
      this.props.toggleWindow();
    }
  }

  render() {
      return (
        <Box
          title="Tabela de Cobrança:"
          width="1000px"
          className="billing-schedule"
          closeBox={this.props.toggleWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          <ProductsSection
            disabled={this.props.master.status !== "inactive"}
            updateBilling={this.updateBilling}
            billingProducts={this.state.billingProducts}
            productsValue={this.state.productsValue}
            AccountsSelector={AccountsSelector}
            accountsDatabase={this.props.accountsDatabase}
            EqualCharges={EqualCharges}/>
          <ServicesSection
            disabled={this.props.master.status !== "inactive"}
            updateBilling={this.updateBilling}
            billingServices={this.state.billingServices}
            startDate={this.state.billingProducts.startDate}
            setCharges={this.setBillingServices}
            servicesValue={this.state.servicesValue}
            AccountsSelector={AccountsSelector}
            accountsDatabase={this.props.accountsDatabase}
            EqualCharges={EqualCharges}/>
          {this.props.master.status === "inactive" ?
            <FooterButtons buttons={[{text: "Salvar", onClick: this.saveEdits}]}/>
          : null}
        </Box>
      )
  }
}