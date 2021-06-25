import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      includeFlyer: true,
      observations: this.props.snapshot.observations
    }
  }
  onChangeFlyer = (e) => {
    this.setState({ includeFlyer: e.target.value });
  }
  onChangeObservations = (e) => {
    function formatConditions(conditions) {
      if (conditions === '') return '';
      conditions = conditions.replace(/\n•$/gm, '');
      conditions = conditions.replace(/• ?/g, '');
      conditions = conditions.replace(/\n/g, '\n• ');
      return '• ' + conditions;
    }

    var key = e.target.name;
    var value = e.target.value;

    if (key === 'conditions') value = formatConditions(value);

    var observations = {
      ...this.state.observations,
      [key]: value
    }
    this.setState({ observations })
  }

  updateSnapshot = () => {
    this.props.updateSnapshot({
      observations: this.state.observations
    }, this.props.toggleWindow)
  }

  generateDocument = () => {
    this.props.updateSnapshot({
      observations: this.state.observations
    }, () => {
      this.props.generateDocument(this.state.includeFlyer);
    })
  }

  selectFooterButtons = () => {
    if (this.props.disabled) {
      return [{
        text: "Gerar Documento",
        className: "button--green",
        onClick: this.generateDocument
      }]
    } else {
      return [
        {text: "Salvar Versão e Gerar Documento",
        className: "button--green",
        onClick: this.generateDocument},
        {text: "Voltar",
        className: "button--secondary",
        onClick: this.props.toggleWindow},
        {text: "Confirmar Edições", className: "button--primary", onClick: this.updateSnapshot}
      ]
    }
  }

  render() {
      return (
        <Box
          title="Imprimir Proposta:"
          className="documents"
          closeBox={this.props.toggleWindow}>
            <Input
              title="Incluir Folders:"
              type="checkbox"
              id="include-flyer"
              value={this.state.includeFlyer}
              onChange={this.onChangeFlyer}
            />
            <Input
              title="Anotações Internas:"
              name="internal"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.observations.internal}
              onChange={this.onChangeObservations}/>
            <Input
              title="Descrição da Proposta (opcional):"
              name="external"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.observations.external}
              onChange={this.onChangeObservations}/>
            <Input
              title="Condições de Pagamento:"
              name="conditions"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.observations.conditions}
              onChange={this.onChangeObservations}/>
            <FooterButtons buttons={this.selectFooterButtons()}/>
        </Box>
      )
  }
}