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
      rep2
    }
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var client = Clients.findOne(this.props.contract.clientId);
      var contacts = client.contacts;
      this.setState({ client, contacts });
    })
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
    return this.state.contacts.map((contact, i) => {
      return <option key={i} value={contact._id}>{contact.name}</option>
    })
  }

  generate = () => {
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
  }

  render() {
      return (
        <Box
          title="Emitir Documentos:"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
              <div>
                <label>Documento:</label>
                <select>
                  <option value="proposal-long">Contrato</option>
                  <option value="invoice-sending">Nota Fiscal de Remessa</option>
                </select>
              </div>
              <Input
                title="Contato"
                type="select"
                name="seller"
                value={this.state.mainContact._id}
                onChange={this.onChange}>
                <option> </option>
                {this.displayContacts()}
              </Input>
              <Input
                title="Representante Legal:"
                type="select"
                name="rep1"
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
              {text: "Gerar", className: "button--primary", onClick: () => this.generate()},
            ]}/>
        </Box>
      )
  }
}