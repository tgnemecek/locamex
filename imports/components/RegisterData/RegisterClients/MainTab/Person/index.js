import { Meteor } from 'meteor/meteor';
import React from 'react';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function Person (props) {
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
        name="description"
        error={props.item.errorKeys.includes("description")}
        value={props.item.description}
        onChange={props.onChange}
      />
      <Input
        title="CPF:"
        type="cpf"
        name="registry"
        error={props.item.errorKeys.includes("registry")}
        value={props.item.registry}
        onChange={props.onChange}
      />
      <Input
        title="RG:"
        type="text"
        name="rg"
        error={props.item.errorKeys.includes("rg")}
        value={props.item.rg}
        onChange={props.onChange}
      />
      <Input
        title="Email:"
        type="email"
        name="email"
        error={props.item.errorKeys.includes("email")}
        value={props.item.email}
        onChange={props.onChange}
      />
      <Input
        title="Telefone 1:"
        type="phone"
        name="phone1"
        error={props.item.errorKeys.includes("phone1")}
        value={props.item.phone1}
        onChange={props.onChange}
      />
      <Input
        title="Telefone 2:"
        type="text"
        name="phone2"
        value={props.item.phone2}
        onChange={props.onChange}
      />
    </Block>
  )
}