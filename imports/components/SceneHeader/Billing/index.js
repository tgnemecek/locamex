import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import ChargesNumber from './ChargesNumber/index';
import EqualCharges from './EqualCharges/index';
import ProductsSection from './ProductsSection/index';
import ServicesSection from './ServicesSection/index';

export default class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingProducts: this.props.master.billingProducts || [],
      billingServices: this.props.master.billingServices || [],

      inss: this.props.master.inss === undefined ? 11 : this.props.master.inss,
      iss: this.props.master.iss === undefined ? 5 : this.props.master.iss,

      masterValue: 0,
      productsValue: 0,
      servicesValue: 0,

      errorMsg: ''
    }
    var duration = this.props.master.dates.timeUnit === "months" ? this.props.master.dates.duration : 1;
    var containers = this.props.master.containers;
    var accessories = this.props.master.accessories || [];
    var services = this.props.master.services || [];
    var discount = this.props.master.discount;

    var containersValue = calcTotalValue(containers, duration);
    var accessoriesValue = calcTotalValue(accessories, duration);
    var servicesValue = calcTotalValue(services, 1);
    var productsValue = (containersValue + accessoriesValue) * (1 - discount);
    var masterValue = productsValue + servicesValue;

    function calcTotalValue (arr, duration) {
      if (arr.length == 0) return 0;
      return arr.reduce((acc, current) => {
        var renting = current.renting ? current.renting : 1;
        return acc + (current.price * renting * duration)
      }, 0);
    }
    this.state = { ...this.state, masterValue, productsValue, servicesValue };
  }

  componentDidMount() {
    if (this.state.masterValue <= 0) {
      this.setState({ errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.' });
    }
  }


  updateState = (key, value) => {
    this.setState({ [key]: value })
  }


  anyZeroBills = () => {
    var charges = this.state.billingProducts.concat(this.state.billingServices);
    for (var i = 0; i < charges.length; i++) {
      if (charges[i].value <= 0) {
        return true
      }
    }
    return false;
  }

  differenceIsZero = () => {
    var billingProducts = this.state.billingProducts;
    var billingServices = this.state.billingServices;
    var masterValue = this.state.masterValue;
    var billingAll = billingProducts.concat(billingServices);
    var total = billingAll.reduce((acc, cur) => {
      return acc = acc + Number(cur.value);
    }, 0);
    total = tools.round(total, 2);
    if (masterValue - total === 0) {
      return true;
    } else return false;
  }

  saveEdits = () => {
    if (this.anyZeroBills()) {
      this.setState({ errorMsg: 'Não devem haver cobranças com valor zero.' });
    } else if (!this.differenceIsZero()) {
      this.setState({ errorMsg: 'O valor resultante das parcelas não coincide com os Valores Totais.' });
    } else if (this.state.masterValue <= 0) {
      this.setState({ errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.' });
    } else {
      this.props.updateMaster({
        billingProducts: this.state.billingProducts,
        billingServices: this.state.billingServices,
        inss: this.state.inss,
        iss: this.state.iss
      });
      this.props.toggleWindow();
    }
  }

  render() {
      return (
        <Box
          title="Tabela de Cobrança:"
          width="1000px"
          className="billing"
          closeBox={this.props.toggleWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          <ProductsSection
            // General Use
            productsValue={this.state.productsValue}
            charges={this.state.billingProducts}
            updateBilling={this.updateState}
            // Left Side
            ChargesNumber={ChargesNumber}
            // Right Side
            EqualCharges={EqualCharges}/>
          <ServicesSection
            // General Use
            servicesValue={this.state.servicesValue}
            charges={this.state.billingServices}
            updateBilling={this.updateState}
            // Left Side
            ChargesNumber={ChargesNumber}
            // Middle
            inss={this.state.inss}
            iss={this.state.iss}
            // Right Side
            EqualCharges={EqualCharges}/>
          <FooterButtons buttons={[{text: "Salvar", onClick: this.saveEdits}]}/>
        </Box>
      )
  }
}