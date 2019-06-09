import { Meteor } from 'meteor/meteor';
import React from 'react';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function Company (props) {
  return (
    <Block columns={6} options={[
      {block: 0, span: 4},
      {block: 1, span: 2},
      {block: 2, span: 4}
    ]}>
      <Input
        title="Nome Fantasia:"
        type="text"
        name="description"
        error={props.item.errorKeys.includes("description")}
        value={props.item.description}
        onChange={props.onChange}
      />
      <Input
        title="CNPJ:"
        type="cnpj"
        name="registry"
        error={props.item.errorKeys.includes("registry")}
        value={props.item.registry}
        onChange={props.onChange}
      />
      <Input
        title="Razão Social:"
        type="text"
        name="officialName"
        error={props.item.errorKeys.includes("officialName")}
        value={props.item.officialName}
        onChange={props.onChange}
      />
      <Input
        title="Ins. Municipal:"
        type="text"
        name="registryMU"
        error={props.item.errorKeys.includes("registryMU")}
        value={props.item.registryMU}
        onChange={props.onChange}
      />
      <Input
        title="Ins. Estadual:"
        type="text"
        name="registryES"
        error={props.item.errorKeys.includes("registryES")}
        value={props.item.registryES}
        onChange={props.onChange}
      />
    </Block>
  )
}