import React from 'react';

import createPdf from '/imports/api/create-pdf/contract/index';
import { Clients } from '/imports/api/clients';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      representatives: this.props.contract.clientReps || ["0000", "0000"]
    }
  }

  componentDidMount() {
    this.contractsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var client = Clients.findOne(this.props.contract.clientId);
      this.setState({ client });
    })
  }

  representativesOnChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    var representatives = tools.deepCopy(this.state.representatives);
    representatives[name] = value;
    this.setState({ representatives });
  }

  displayContacts = () => {
    if (!this.state.client.contacts) return null;
    return this.state.client.contacts.map((contact, i) => {
      return <option key={i} value={contact._id}>{contact.name}</option>
    })
  }

  generate = () => {
    var seller = {
      contact: 'Nome do Vendedor',
      phone: '(11) 94514-8263',
      email: 'tgnemecek@gmail.com'
    };
    var contacts = this.state.client.contacts;
    var representativesTemp = tools.deepCopy(this.state.representatives);
    if (representativesTemp[0] === representativesTemp[1]) {
      representativesTemp.splice(1, 1);
    }
    var representatives = tools.deepCopy(representativesTemp);
    representativesTemp.forEach((rep) => {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts._id === rep) {
          rep = {
            contactName: contact.name,
            cpf: contact.cpf,
            rg: contact.rg,
          }
          representatives.push(rep);
          break;
        }
      }
    })
    console.log('doc', representatives);
    createPdf(this.props.contract, this.state.client, seller, representatives);
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
                title="Representante Legal:"
                type="select"
                name={0}
                value={this.state.representatives[0]}
                onChange={this.representativesOnChange}>
                {this.displayContacts()}
              </Input>
              <Input
                title="Segundo Representante: (opcional)"
                type="select"
                name={1}
                value={this.state.representatives[1]}
                onChange={this.representativesOnChange}>
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