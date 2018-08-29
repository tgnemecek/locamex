import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class AddressTab extends React.Component {
  onChange = (e) => {
    var address = {
      ...this.props.item.address,
      [e.target.name]: e.target.value
    };
    var exportObj = {target: {
      value: address,
      name: 'address'
    }}
    this.props.onChange(exportObj);
  }
  cepButtonClick = (data) => {
    if (!data.cep) return;
    var address = {
      ...this.props.item.address,
      street: data.logradouro,
      city: data.localidade,
      state: data.uf,
      number: '',
      additional: ''
    };
    var exportObj = {target: {
      value: address,
      name: 'address'
    }}
    this.props.onChange(exportObj);
  }
  render() {
    return (
      <ErrorBoundary>
        <Block
          columns={3}
          options={[{block: 0, span: 2}, {block: 3, span: 0.5}, {block: 4, span: 0.5}]}>
          <Input
            title="Rua:"
            name="street"
            type="text"
            value={this.props.item.address.street}
            onChange={this.onChange}
          />
          <Input
            title="CEP:"
            name="cep"
            type="cep"
            buttonClick={this.cepButtonClick}
            value={this.props.item.address.cep}
            onChange={this.onChange}
          />
          <Input
            title="Cidade:"
            name="city"
            type="text"
            value={this.props.item.address.city}
            onChange={this.onChange}
          />
          <Input
            title="Estado:"
            type="select"
            name="state"
            onChange={this.onChange}
            value={this.props.item.address.state}>
            {tools.states.map((item, i) => {
              return <option key={i} value={item}>{item}</option>
            })}
          </Input>
          <Input
            title="Número:"
            name="number"
            type="number"
            value={this.props.item.address.number}
            onChange={this.onChange}
          />
          <Input
            title="Complemento:"
            name="additional"
            type="text"
            value={this.props.item.address.additional}
            onChange={this.onChange}
          />
        </Block>
      </ErrorBoundary>
    )
  }
}