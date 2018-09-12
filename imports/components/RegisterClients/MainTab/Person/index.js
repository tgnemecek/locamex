import { Meteor } from 'meteor/meteor';
import React from 'react';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function Person (props) {
  return (
    <Block columns={4} options={[{block: 1, span: 3}, {block: 2, span: 2}, {block: 3, span: 2}, {block: 4, span: 2}]}>
      <Input
        title="Código:"
        type="text"
        disabled={true}
        name="_id"
        value={props.item._id}
        onChange={props.onChange}
      />
      <Input
        title="Nome Completo:"
        type="text"
        name="description"
        value={props.item.description}
        onChange={props.onChange}
      />
      <Input
        title="CPF:"
        type="cpf"
        name="registry"
        value={props.item.registry}
        onChange={props.onChange}
      />
      <Input
        title="RG:"
        type="rg"
        name="rg"
        value={props.item.rg}
        onChange={props.onChange}
      />
      <Input
        title="Email:"
        type="email"
        name="email"
        value={props.item.email}
        onChange={props.onChange}
      />
      <Input
        title="Telefone 1:"
        type="phone"
        name="phone1"
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