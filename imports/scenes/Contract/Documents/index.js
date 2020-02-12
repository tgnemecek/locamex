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
      negociatorId: this.props.negociatorId,
      representativesId: this.props.representativesId
    }
  }
  onChangeNegociator = (e) => {
    var negociatorId = e.target.value;
    this.setState({ negociatorId })
  }

  onChangeRepresentatives = (e) => {
    var _id = e.target.value;
    var i = Number(e.target.name);
    var representativesId = [...this.state.representativesId];
    representativesId[i] = _id;
    this.setState({ representativesId });
  }

  displayContacts = (which) => {
    var contacts = [];
    if (which === 'negociator') {
      contacts = this.props.client.contacts.filter((contact) => {
        return (contact.name && contact.phone1 && contact.email);
      })
    } else if (which === 'rep') {
      contacts = this.props.client.contacts.filter((contact) => {
        return (contact.name && contact.cpf && contact.rg);
      })
    }
    return contacts.map((contact, i) => {
      return <option key={i} value={contact._id}>{contact.name}</option>
    })
  }

  generateDocument = () => {
    this.props.updateSnapshot({
      negociatorId: this.state.negociatorId,
      representativesId: this.state.representativesId
    }, () => {
      if (this.props.verifyFields()) {
        this.props.generateDocument();
      } else {
        this.props.toggleWindow();
      }
    });
  }

  saveEdits = () => {
    this.props.updateSnapshot({
      negociatorId: this.state.negociatorId,
      representativesId: this.state.representativesId
    }, this.props.toggleWindow);
  }

  selectFooterButtons = () => {
    if (this.props.disabled) {
      return [{
        text: "Gerar Documento",
        className: "button--green",
        onClick: this.generateDocument
      }]
    }
    var buttons = [{
      text: "Salvar Versão e Gerar Documento",
      className: "button--green",
      onClick: this.generateDocument
    }]
    if (this.props.client.type === "person") {
      return buttons;
    } else {
      return [
        ...buttons,
        {text: "Voltar",
        className: "button--secondary",
        onClick: this.props.toggleWindow},
        {text: "Confirmar Edições",
        className: "button--primary",
        onClick: this.saveEdits},
      ]
    }
  }

  render() {
      return (
        <Box
          title="Emitir Documento:"
          className="documents"
          help="Para o contato de Negociador aparecer na lista, é obrigatório o preenchimento do Nome, Email e Telefone #1. Para o contato de Representante Legal, é obrigatório o preenchimento do Nome, CPF e RG. Tais preenchimentos são feitos exclusivamente na página de Clientes, ao editar o respectivo registro de Cliente."
          closeBox={this.props.toggleWindow}>
          {this.props.client._id ?
            <>
              <Input
                title="Contato da Negociação:"
                type="select"
                name="negociatorId"
                disabled={this.props.disabled}
                error={this.props.errorKeys.includes("negociatorId")}
                value={this.props.negociatorId}
                onChange={this.onChangeNegociator}>
                <option> </option>
                {this.displayContacts('negociator')}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="0"
                disabled={this.props.disabled}
                error={this.props.errorKeys.includes("rep0")}
                value={this.props.representativesId[0]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts('rep')}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name="1"
                disabled={this.props.disabled}
                value={this.props.representativesId[1]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts('rep')}
              </Input>
              <FooterButtons buttons={this.selectFooterButtons()}/>
            </>
          : "Adicione um cliente antes."}
        </Box>
      )
  }
}