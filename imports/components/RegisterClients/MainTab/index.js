import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class MainTab extends React.Component {
  render() {
    return (
      <>
        <Block columns={6} options={[{block: 1, span: 3}, {block: 2, span: 2}]}>
          <Input
            title="Código:"
            type="text"
            disabled={true}
            name="_id"
            value={this.props.itemState._id}
            onChange={this.props.onChange}
          />
          <Input
            title="Nome:"
            type="text"
            name="description"
            value={this.props.itemState.description}
            onChange={this.props.onChange}
          />
          <Input
            title={this.props.itemState.type === 'company' ? "CNPJ:" : "CPF:"}
            type={this.props.itemState.type === 'company' ? "cnpj" : "cpf"}
            name="registry"
            value={this.props.itemState.price}
            onChange={this.props.onChange}
          />
        </Block>
        {this.props.itemState.type === 'company' ?
          <Block columns={2} options={[{block: 0, span: 2}]}>
            <Input
              title="Razão Social:"
              type="text"
              name="officialName"
              value={this.props.itemState._id}
              onChange={this.props.onChange}
            />
            <Input
              title="Inscrição Municipal:"
              type="text"
              name="registryMU"
              value={this.props.itemState._id}
              onChange={this.props.onChange}
            />
            <Input
              title="Inscrição Estadual:"
              type="text"
              name="registryES"
              value={this.props.itemState._id}
              onChange={this.props.onChange}
            />
          </Block>
          : null}
      </>
    )
  }
}