import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class AddressTab extends React.Component {
  render() {
    return (
      <>
        <Block columns={6} options={[{block: 1, span: 3}, {block: 2, span: 2}]}>
          <Input
            title="Código:"
            type="text"
            disabled={true}
            name="_id"
            value={this.state._id}
            onChange={this.props.onChange}
          />
          <Input
            title="Nome:"
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.props.onChange}
          />
          <Input
            title={this.props.item.type === 'company' ? "CNPJ:" : "CPF:"}
            type={this.props.item.type === 'company' ? "cnpj" : "cpf"}
            name="registry"
            value={this.state.price}
            onChange={this.props.onChange}
          />
        </Block>
        {this.props.item.type === 'company' ?
          <Block columns={2} options={[{block: 0, span: 2}]}>
            <Input
              title="Razão Social:"
              type="text"
              name="officialName"
              value={this.state._id}
              onChange={this.props.onChange}
            />
            <Input
              title="Inscrição Municipal:"
              type="text"
              name="registryMU"
              value={this.state._id}
              onChange={this.props.onChange}
            />
            <Input
              title="Inscrição Estadual:"
              type="text"
              name="registryES"
              value={this.state._id}
              onChange={this.props.onChange}
            />
          </Block>
          : null}
      </>
    )
  }
}