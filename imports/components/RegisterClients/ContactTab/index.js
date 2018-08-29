import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class ContactTab extends React.Component {
  onChange = (e) => {
    var contacts = tools.deepCopy(this.props.item.contacts);
    var tab = (Number(this.props.item.tab) - 2);
    contacts[tab] = {
      ...this.props.item.contacts[tab],
      [e.target.name]: e.target.value
    };
    var exportObj = {
      target: {
        value: contacts,
        name: 'contacts'
      }
    };
    this.props.onChange(exportObj);
  }
  render() {
    var tab = (Number(this.props.item.tab) - 2);
    var firstContactPerson = false;
    if (this.props.item.type === 'person' && tab === 0) firstContactPerson = true;
    return (
      <ErrorBoundary>
        <Block columns={4} options={[{block: 1, span: 3}, {block: 2, span: 2}, {block: 3, span: 2}, {block: 4, span: 2}]}>
          <Input
            title="Código:"
            type="text"
            disabled={true}
            name="_id"
            value={this.props.item.contacts[tab]._id}
            onChange={this.onChange}
          />
          <Input
            title="Nome:"
            type="text"
            name="name"
            disabled={firstContactPerson}
            value={firstContactPerson ? this.props.item.description : this.props.item.contacts[tab].name}
            onChange={this.onChange}
          />
          <Input
            title="CPF:"
            type="cpf"
            name="cpf"
            value={this.props.item.contacts[tab].cpf}
            onChange={this.onChange}
          />
          <Input
            title="RG:"
            type="rg"
            name="rg"
            value={this.props.item.contacts[tab].rg}
            onChange={this.onChange}
          />
          <Input
            title="Email:"
            type="email"
            name="email"
            value={this.props.item.contacts[tab].email}
            onChange={this.onChange}
          />
          <Input
            title="Telefone 1:"
            type="phone"
            name="phone1"
            value={this.props.item.contacts[tab].phone1}
            onChange={this.onChange}
          />
          <Input
            title="Telefone 2:"
            type="text"
            name="phone2"
            value={this.props.item.contacts[tab].phone2}
            onChange={this.onChange}
          />
        </Block>
      </ErrorBoundary>
    )
  }
}