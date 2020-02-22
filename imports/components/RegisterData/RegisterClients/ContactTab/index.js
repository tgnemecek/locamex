import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function ContactTab (props) {

  const tab = (Number(props.item.tab) - 2);

  onChange = (e) => {
    var contacts = [...props.item.contacts];
    contacts[tab] = {
      ...props.item.contacts[tab],
      [e.target.name]: e.target.value
    };
    var exportObj = {
      target: {
        value: contacts,
        name: 'contacts'
      }
    };
    props.onChange(exportObj);
  }
  style = (name) => {
    if (tab === 0 && props.item.type === "company") {
      if (props.item.errorKeys.includes(name)) {
        return {borderColor: "red"}
      } else return null
    }
  }
  return (
    <Block columns={4} options={[
      {block: 0, span: 4},
      {block: 1, span: 2},
      {block: 2, span: 2},
      {block: 3, span: 2}
    ]}>
      <Input
        title="Nome Completo:"
        type="text"
        name="name"
        style={style("name")}
        value={props.item.contacts[tab].name}
        onChange={onChange}
        disabled={props.disabled}
      />
      <Input
        title="CPF:"
        type="cpf"
        name="cpf"
        style={style("cpf")}
        value={props.item.contacts[tab].cpf}
        onChange={onChange}
        disabled={props.disabled}
      />
      <Input
        title="RG:"
        type="rg"
        name="rg"
        style={style("rg")}
        value={props.item.contacts[tab].rg}
        onChange={onChange}
        disabled={props.disabled}
      />
      <Input
        title="Email:"
        type="email"
        name="email"
        style={style("email")}
        value={props.item.contacts[tab].email}
        onChange={onChange}
        disabled={props.disabled}
      />
      <Input
        title="Telefone 1:"
        type="phone"
        name="phone1"
        style={style("phone1")}
        value={props.item.contacts[tab].phone1}
        onChange={onChange}
        disabled={props.disabled}
      />
      <Input
        title="Telefone 2:"
        type="text"
        name="phone2"
        value={props.item.contacts[tab].phone2}
        onChange={onChange}
        disabled={props.disabled}
      />
    </Block>
  )
}