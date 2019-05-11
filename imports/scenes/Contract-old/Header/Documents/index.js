import React from 'react';

import createPdf from '/imports/api/create-pdf/contract/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: tools.findUsingId(this.props.databases.clientsDatabase, this.props.contract.clientId),
      negociatorId: this.props.contract.negociatorId || '',
      representativesId: this.props.contract.representativesId || [],

      errorMsg: '',
      errorKeys: []
    }
  }

  onChangeMain = (e) => {
    var negociatorId = e.target.value;
    this.setState({ negociatorId });
  }

  onChangeRepresentatives = (e) => {
    var _id = e.target.value;
    var i = Number(e.target.name);
    var representativesId = tools.deepCopy(this.state.representativesId);
    representativesId[i] = _id;
    this.setState({ representativesId });
  }

  displayContacts = (which) => {
    var contacts = [];
    if (which === 'negociator') {
      contacts = this.state.client.contacts.filter((contact) => {
        return (contact.name && contact.phone1 && contact.email);
      })
    } else if (which === 'rep') {
      contacts = this.state.client.contacts.filter((contact) => {
        return (contact.name && contact.cpf && contact.rg);
      })
    }
    return contacts.map((contact, i) => {
      return <option key={i} value={contact._id}>{contact.name}</option>
    })
  }

  generate = () => {
    // Initial checking of conditions
    var errorMsg = '';
    var errorKeys = [];

    if (!this.state.negociatorId) errorKeys.push("negociatorId");
    if (!this.state.representativesId[0]) errorKeys.push("rep1");

    if (errorKeys.length) {
      errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';
      this.setState({ errorMsg, errorKeys });
      return;
    }
    // Conditions are ok, now preparing info to be sent to the pdf generator
    var negociatorId = this.state.negociatorId;
    var representativesId = this.state.representativesId;
    if (representativesId[0] == representativesId[1] || !representativesId[1]) {
      representativesId = [ representativesId[0] ];
    }

    const getPersonUsingId = (arrayOfIds) => {
      var people = [];
      arrayOfIds.forEach((id) => {
        this.state.client.contacts.forEach((item) => {
          if (item._id === id) {
            people.push(item)
          }
        })
      })
      return people;
    }

    var version = this.props.contract.version + 1;
    var negociator = getPersonUsingId([negociatorId])[0];
    var representatives = getPersonUsingId(representativesId);
    // Saves changes to contract
    this.props.updateContract({
      representativesId,
      negociatorId,
      version
    }, () => {
      createPdf({ ...this.props.contract, client: this.state.client, negociator, representatives });
      this.props.saveContract();
    });
    this.setState({ errorMsg, errorKeys });
  }

  render() {
      return (
        <Box
          title="Emitir Contrato:"
          width="400px"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
              <h3 style={{color: "red"}}>AVISO: A emissão de PDF não está pronta para Pessoa Física na versão atual!</h3>
              <Input
                title="Contato da Negociação:"
                type="select"
                name="negociatorId"
                style={this.state.errorKeys.includes("negociatorId") ? {borderColor: "red"} : null}
                value={this.state.negociatorId}
                onChange={this.onChangeMain}>
                <option> </option>
                {this.displayContacts('negociator')}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="0"
                style={this.state.errorKeys.includes("rep1") ? {borderColor: "red"} : null}
                value={this.state.representativesId[0]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts('rep')}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name="1"
                value={this.state.representativesId[1]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts('rep')}
              </Input>
            </div>
            <FooterButtons buttons={[
              {text: "Salvar e Gerar Documento", className: "button--primary", onClick: this.generate},
            ]}/>
        </Box>
      )
  }
}