import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import createPdf from '/imports/api/create-pdf/contract/index';
import { Clients } from '/imports/api/clients/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  displayContacts = () => {
    return this.props.client.contacts.map((contact, i) => {
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
        this.props.client.contacts.forEach((item) => {
          if (item._id === id) {
            people.push(item)
          }
        })
      })
      return people;
    }
    // Sends info to createPdf
    var negociator = getPersonUsingId([negociatorId])[0];
    var representatives = getPersonUsingId(representativesId);
    createPdf(this.props.contract, this.props.client, negociator, representatives);
    // Saves changes to contract
    this.props.updateContract({
      representatives: representativesId,
      negociator: negociatorId
    })
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
                error={this.state.errorKeys.includes("negociator")}
                value={this.state.negociator}
                onChange={this.onChangeMain}>
                <option> </option>
                {this.displayContacts()}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="0"
                error={this.state.errorKeys.includes("rep1")}
                value={this.state.representatives[0]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts()}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name="1"
                value={this.state.representatives[1]}
                onChange={this.onChangeRepresentatives}>
                <option> </option>
                {this.displayContacts()}
              </Input>
            </div>
            <FooterButtons buttons={[
              {text: "Salvar e Gerar Documento", className: "button--primary", onClick: this.generate},
            ]}/>
        </Box>
      )
  }
}

export default DocumentsWrapper = withTracker((props) => {
  Meteor.subscribe('clientsPub');
  var client = Clients.findOne({_id: props.contract.client});
  return {
    client
  }
})(Documents);