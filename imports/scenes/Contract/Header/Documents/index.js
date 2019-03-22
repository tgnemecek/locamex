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
      client: tools.findUsingId(this.props.databases.clientsDatabase, this.props.contract.client),
      negociator: this.props.contract.negociator || '',
      representatives: this.props.contract.representatives || [],

      errorMsg: '',
      errorKeys: []
    }
  }

  onChangeMain = (e) => {
    var negociator = e.target.value;
    this.setState({ negociator });
  }

  onChangeRepresentatives = (e) => {
    var _id = e.target.value;
    var i = Number(e.target.name);
    var representatives = tools.deepCopy(this.state.representatives);
    representatives[i] = _id;
    this.setState({ representatives });
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

    if (!this.state.negociator) errorKeys.push("negociator");
    if (!this.state.representatives[0]) errorKeys.push("rep1");

    if (errorKeys.length) {
      errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';
      this.setState({ errorMsg, errorKeys });
      return;
    }
    // Conditions are ok, now preparing info to be sent to the pdf generator
    var negociatorId = this.state.negociator;
    var representativesId = this.state.representatives;
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

    const assembleContractReferences = (negociator, representatives) => {
      var containersDatabase = this.props.databases.containersDatabase;
      var accessoriesDatabase = this.props.databases.accessoriesDatabase;
      var servicesDatabase = this.props.databases.servicesDatabase;

      var contract = { ...this.props.contract };
      var client = this.state.client;

      var containers = contract.containers.map((item) => {
        return { ...item, description: tools.findUsingId(containersDatabase, item._id).description }
      })
      var accessories = contract.accessories.map((item) => {
        return { ...item, description: tools.findUsingId(accessoriesDatabase, item._id).description }
      })
      var services = contract.services.map((item) => {
        return { ...item, description: tools.findUsingId(servicesDatabase, item._id).description }
      })

      return { ...contract, client, containers, accessories, services, negociator, representatives };
    }

    var version = this.props.contract.version + 1;
    var negociator = getPersonUsingId([negociatorId])[0];
    var representatives = getPersonUsingId(representativesId);
    // Saves changes to contract
    this.props.updateContract({
      representatives: representativesId,
      negociator: negociatorId,
      version
    }, () => {
      var assembledContract = assembleContractReferences(negociator, representatives);
      createPdf(assembledContract);
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
                name="negociator"
                style={this.state.errorKeys.includes("negociator") ? {borderColor: "red"} : null}
                value={this.state.negociator}
                onChange={this.onChangeMain}>
                <option> </option>
                {this.displayContacts('negociator')}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="0"
                style={this.state.errorKeys.includes("rep1") ? {borderColor: "red"} : null}
                value={this.state.representatives[0]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts('rep')}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name="1"
                value={this.state.representatives[1]}
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