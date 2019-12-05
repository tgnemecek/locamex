import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      internal: this.props.master.observations.internal || '',
      external: this.props.master.observations.external || '',
      conditions: this.props.master.observations.conditions ?
        conditionsToString(this.props.master.observations.conditions) :
        createConditions(this.props.master.dates.timeUnit)
    }
  }

  onChange = (e) => {
    var key = e.target.name;
    var value = key === 'conditions' ? e.target.value : e.target.value;

    this.setState({ [key]: value });
  }

  saveEdits = () => {
    this.props.updateMaster({ observations: this.state });
    this.props.toggleWindow();
  }

  render() {
      return (
        <Box
          title="Observações"
          className="observations"
          closeBox={this.props.toggleWindow}
          width="400px">
            <Input
              title="Controle Interno:"
              name="internal"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.internal}
              onChange={this.onChange}/>
            <Input
              title="Para o Cliente:"
              name="external"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.external}
              onChange={this.onChange}/>
            <Input
              title="Condições de Pagamento:"
              name="conditions"
              type="textarea"
              disabled={this.props.disabled}
              value={formatConditions(this.state.conditions)}
              onChange={this.onChange}/>
            <FooterButtons buttons={this.props.disabled
              ? [{text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow}]
              : [{text: "Salvar Edições", onClick: this.saveEdits}]}/>
        </Box>
      )
  }
}

function formatConditions(conditions) {
  conditions = conditions.replace(/• ?/g, '');
  conditions = conditions.replace(/\n/g, '\n• ');
  console.log(conditionsToArray('\n• ' + conditions));
  return '\n• ' + conditions;
  // conditions = conditions.replace(/\n([^ ])/g, '\n• $1');
  // conditions = conditions.replace(/^•([^ ])/g, '\n• $1');
  // return conditions;
}

function conditionsToArray(conditions) {
  conditions = conditions.trim().replace(/^• /g, '');
  return conditions.split('\n• ');
}

function conditionsToString(conditions) {
  return '• ' + conditions.join('\n• ');
}

function createConditions(timeUnit) {
  var conditions = [];

  if (timeUnit === "months") {
    conditions.push('Valores referentes à locação deverão ser pagos mensalmente, com primeiro pagamento em 15 dias da entrega.');
    conditions.push('Valores referentes ao Pacote de Serviços deverão ser pagos com sinal no ato e 50% de saldo em 30 dias.');
  } else {
    conditions.push('O Valor Total do Orçamento deverá ser pago com sinal de 50% no fechamento da proposta e 50% de saldo em até 3 dias antes da entrega.')
  }
  return conditionsToString(conditions);
}