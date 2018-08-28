import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class ContactTab extends React.Component {
  render() {
    return (
      <>
        <Block
          className="contract__information"
          columns={6}>
          <Input
            title="Rua:"
            name="street"
            type="text"
            extra="deliveryAddress"
            value={this.props.contract.deliveryAddress.street}
            onChange={this.handleChange}
          />
          <Input
            title="CEP:"
            name="cep"
            type="cep"
            extra="deliveryAddress"
            buttonClick={this.cepButtonClick}
            value={this.props.contract.deliveryAddress.cep}
            onChange={this.handleChange}
          />
          <Input
            title="Cidade:"
            name="city"
            type="text"
            extra="deliveryAddress"
            value={this.props.contract.deliveryAddress.city}
            onChange={this.handleChange}
          />
          <Input
            title="Estado:"
            type="select"
            name="state"
            extra="deliveryAddress"
            onChange={this.handleChange}
            value={this.props.contract.deliveryAddress.state}>
            {tools.states.map((item, i) => {
              return <option key={i} value={item}>{item}</option>
            })}
          </Input>
          <Input
            title="Número:"
            name="number"
            type="number"
            extra="deliveryAddress"
            value={this.props.contract.deliveryAddress.number}
            onChange={this.handleChange}
          />
          <Input
            title="Complemento:"
            name="additional"
            type="text"
            extra="deliveryAddress"
            value={this.props.contract.deliveryAddress.additional}
            onChange={this.handleChange}
          />
        </Block>
          : null}
      </>
    )
  }
}