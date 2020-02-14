import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Accounts } from '/imports/api/accounts/index';

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

class BillingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingProducts: [],
      billingServices: [],
      errorMsg: ''
    }
  }

  componentDidMount() {
    if (this.totalValue() <= 0) {
      this.setState({
        errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.'
      });
    } else if (!this.props.snapshot.services.length) {
      this.setState({
        errorMsg: 'Adicione ao menos um serviço'
      });
    } else {
      this.setBillingProducts();
      this.setBillingServices();
    }
  }

  updateBilling = (changes) => {
    this.setState({
      ...this.state,
      ...changes
    });
  }

  totalValue = (type) => {
    var duration = this.props.snapshot.dates.duration;
    if (this.props.snapshot.dates.timeUnit === "days") {
      duration = 1;
    }
    var discount = this.props.snapshot.discount;

    var containers = this.props.snapshot.containers || [];
    var accessories = this.props.snapshot.accessories || [];
    var services = this.props.snapshot.services || [];

    function calculate (arr, duration) {
      if (arr.length == 0) return 0;
      return arr.reduce((acc, current) => {
        var quantity = current.quantity ? current.quantity : 1;
        return acc + (current.price * quantity * duration)
      }, 0);
    }

    switch (type) {
      case 'products':
        var products = containers.concat(accessories);
        return calculate(products, duration);
      case 'services':
        return calculate(services, 1);
      default:
        var products = containers.concat(accessories);
        var productsValue = calculate(products, duration);
        var servicesValue = calculate(services, 1);
        return productsValue + servicesValue;
    }
  }

  setBillingProducts = () => {
    if (this.props.snapshot.billingProducts) {
      if (this.props.snapshot.billingProducts.length) {
        this.setState({ billingProducts: this.props.snapshot.billingProducts });
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
      billingProducts, this.props.snapshot.dates.startDate
    )
    this.setState({ billingProducts });
  }

  setBillingServices = (quantity, firstSetup) => {
    function getDescription(i, length) {
      return `Parcela ${i + 1} de ${length} do Pacote de Serviços`
    }
    if (firstSetup) {
      if (!quantity) return;
      if (this.props.snapshot.billingServices) {
        if (this.props.snapshot.billingServices.length) {
          this.setState({
            billingServices: this.props.snapshot.billingServices
          });
          return;
        }
      }
      var billingServices = [
        {
          expiryDate: moment(this.props.snapshot.dates.startDate)
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
    var snapshotValue = this.state.productsValue + this.state.servicesValue;
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
      return snapshotValue - total !== 0;
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
    } else if (snapshotValue <= 0) {
      this.setState({ errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.' });
    } else {
      this.props.updateSnapshot({
        billingProducts: this.state.billingProducts,
        billingServices: this.state.billingServices
      });
      this.props.closeWindow();
    }
  }

  render() {

      return (
        <Box
          title="Tabela de Cobrança:"
          width="1000px"
          className="billing-schedule"
          closeBox={this.props.closeWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          <ProductsSection
            disabled={this.props.snapshot.status !== "inactive"}
            updateBilling={this.updateBilling}
            billingProducts={this.state.billingProducts}
            productsValue={this.state.productsValue}
            AccountsSelector={AccountsSelector}
            accountsDatabase={this.props.accountsDatabase}
            EqualCharges={EqualCharges}/>
          <ServicesSection
            disabled={this.props.snapshot.status !== "inactive"}
            updateBilling={this.updateBilling}
            billingServices={this.state.billingServices}
            startDate={this.state.billingProducts.startDate}
            setCharges={this.setBillingServices}
            servicesValue={this.state.servicesValue}
            AccountsSelector={AccountsSelector}
            accountsDatabase={this.props.accountsDatabase}
            EqualCharges={EqualCharges}/>
          {this.props.snapshot.status === "inactive" ?
            <FooterButtons buttons={[{text: "Salvar", onClick: this.saveEdits}]}/>
          : null}
        </Box>
      )
  }
}

export default BillingScheduleWrapper = withTracker((props) => {
  Meteor.subscribe('accountsPub');

  var accountsDatabase = Accounts.find().fetch();

  return {
    accountsDatabase
  }
})(BillingSchedule);