import { Meteor } from 'meteor/meteor';
import React from 'react';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function Company (props) {
  return (
    <Block columns={6} options={[
      {block: 1, span: 3},
      {block: 2, span: 2},
      {block: 3, span: 4}
    ]}>
      <Input
        title="Código:"
        type="text"
        disabled={true}
        name="_id"
        value={props.item._id}
        onChange={props.onChange}
      />
      <Input
        title="Nome Fantasia:"
        type="text"
        name="description"
        value={props.item.description}
        onChange={props.onChange}
      />
      <Input
        title="CNPJ:"
        type="cnpj"
        name="registry"
        value={props.item.registry}
        onChange={props.onChange}
      />
      <Input
        title="Razão Social:"
        type="text"
        name="officialName"
        value={props.item.officialName}
        onChange={props.onChange}
      />
      <Input
        title="Ins. Municipal:"
        type="text"
        name="registryMU"
        value={props.item.registryMU}
        onChange={props.onChange}
      />
      <Input
        title="Ins. Estadual:"
        type="text"
        name="registryES"
        value={props.item.registryES}
        onChange={props.onChange}
      />
    </Block>
  )
}