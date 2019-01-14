import React from 'react';

import createPdf from '/imports/api/create-pdf/contract/index';
import { Clients } from '/imports/api/clients/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    var rep1 = {};
    var rep2 = {};
    if (this.props.contract.representatives) {
      if (this.props.contract.representatives[0]) {
        rep1 = this.props.contract.representatives[0];
      }
      if (this.props.contract.representatives[1]) {
        rep2 = this.props.contract.representatives[1];
      }
    }
    this.state = {
      client: {},
      contacts: [],
      mainContact: this.props.contract.mainContact || {},
      rep1,
      rep2,

      errorMsg: '',
      errorKeys: []
    }
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var client = Clients.findOne(this.props.contract.client);
      var contacts = [];
      client.contacts.forEach((contact) => {
        if (contact.visible) contacts.push(contact)
      });
      if (client.type == 'person') {
        var firstContact = {
          _id: "0000",
          name: client.description,
          cpf: client.registry,
          rg: client.rg,
          phone1: client.phone1,
          phone2: client.phone2,
          email: client.email,
          visible: true
        }
        contacts.unshift(firstContact);
      }
      this.setState({ client, contacts });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
  }

  onChange = (e) => {
    var contactId = e.target.value;
    var name = e.target.name;
    var contacts = this.state.contacts;
    var value = {};
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i]._id == contactId) {
        value = contacts[i];
        break;
      }
    }
    this.setState({ [name]: value });
  }

  displayContacts = () => {
    if (!this.state.contacts) return null;

    var contacts = tools.deepCopy(this.state.contacts);
    var client = this.state.client;
    return contacts.map((contact, i) => {
      return <option key={i} value={contact._id}>{contact.name}</option>
    })
  }

  generate = () => {
    var errorMsg = '';
    var errorKeys = [];

    if (!this.state.mainContact._id) errorKeys.push("mainContact");
    if (!this.state.rep1._id) errorKeys.push("rep1");

    if (errorKeys.length) {
      errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';
      this.setState({ errorMsg, errorKeys });
      return;
    } else {
      var contacts = this.state.contacts;
      var representatives;
      if (this.state.rep1 == this.state.rep2 || !this.state.rep2._id) {
        representatives = [ this.state.rep1 ];
      } else {
        representatives = [
          this.state.rep1,
          this.state.rep2
        ]
      }

      createPdf(this.props.contract, this.state.client, this.state.mainContact, representatives);
      var exportReps = representatives.map((rep) => {
        return rep._id;
      })
      var mainContact = this.state.mainContact._id;
      this.props.updateContract([exportReps, mainContact], ["representatives", "mainContact"]);
      this.setState({ errorMsg, errorKeys });
    }
  }

  render() {
      return (
        <Box
          title="Emitir Contrato:"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
              <h3 style={{color: "red"}}>AVISO: A emissão de PDF não está pronta para Pessoa Física na versão atual!</h3>
              <Input
                title="Contato:"
                type="select"
                name="mainContact"
                style={this.state.errorKeys.includes("mainContact") ? {borderColor: "red"} : null}
                value={this.state.mainContact._id}
                onChange={this.onChange}>
                <option> </option>
                {this.displayContacts()}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="rep1"
                style={this.state.errorKeys.includes("rep1") ? {borderColor: "red"} : null}
                value={this.state.rep1._id}
                onChange={this.onChange}>
                <option> </option>
                {this.displayContacts()}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name="rep2"
                value={this.state.rep2._id}
                onChange={this.onChange}>
                <option> </option>
                {this.displayContacts()}
              </Input>
            </div>
            <FooterButtons buttons={[
              {text: "Gerar", className: "button--primary", onClick: this.generate},
            ]}/>
        </Box>
      )
  }
}