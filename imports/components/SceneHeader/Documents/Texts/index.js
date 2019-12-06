import React from 'react';

import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Texts extends React.Component {
  componentDidMount() {
    if (this.props.master.observations.conditions === undefined) {
      this.props.updateMaster({ observations: {
        ...this.props.master.observations,
        conditions: createConditions(this.props.master.observations.conditions, this.props.master.dates.timeUnit)
      } });
    }
  }
  onChange = (e) => {
    var key = e.target.name;

    var observations = {
      ...this.props.master.observations,
      [key]: key === 'conditions' ?
              formatConditions(e.target.value) : e.target.value
    }

    this.props.updateMaster({ observations });
  }

  render() {
      return (
        <>
          <Input
            title="Anotações Internas:"
            name="internal"
            type="textarea"
            disabled={this.props.disabled}
            value={this.props.master.observations.internal}
            onChange={this.onChange}/>
          <Input
            title="Observações para o Cliente:"
            name="external"
            type="textarea"
            disabled={this.props.disabled}
            value={this.props.master.observations.external}
            onChange={this.onChange}/>
          <Input
            title="Condições de Pagamento:"
            name="conditions"
            type="textarea"
            disabled={this.props.disabled}
            value={this.props.master.observations.conditions}
            onChange={this.onChange}/>
        </>
      )
  }
}

function formatConditions(conditions) {
  if (conditions === '') return '';
  conditions = conditions.replace(/• ?/g, '');
  conditions = conditions.replace(/\n/g, '\n• ');
  return '• ' + conditions;
}

function createConditions(conditions, timeUnit) {
  if (conditions) return conditions;

  if (timeUnit === "months") {
    return '• Valores referentes à locação deverão ser pagos mensalmente, com primeiro pagamento em 15 dias da entrega.\n• Valores referentes ao Pacote de Serviços deverão ser pagos com sinal no ato e 50% de saldo em 30 dias.';
  } else return '• O Valor Total do Orçamento deverá ser pago com sinal de 50% no fechamento da proposta e 50% de saldo em até 3 dias antes da entrega.'
}