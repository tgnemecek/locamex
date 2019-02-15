import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function AddressTab (props) {
  onChange = (e) => {
    var address = {
      ...props.item.address,
      [e.target.name]: e.target.value
    };
    var exportObj = {target: {
      value: address,
      name: 'address'
    }}
    props.onChange(exportObj);
  }
  cepButtonClick = (data) => {
    if (!data.cep) return;
    var address = {
      ...props.item.address,
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
    props.onChange(exportObj);
  }
  return (
    <Block
      columns={3}
      options={[{block: 0, span: 2}, {block: 3, span: 0.5}, {block: 4, span: 0.5}]}>
      <Input
        title="Endereço:"
        name="street"
        type="text"
        style={props.item.errorKeys.includes("street") ? {borderColor: "red"} : null}
        value={props.item.address.street}
        onChange={onChange}
      />
      <Input
        title="CEP:"
        name="cep"
        type="cep"
        style={props.item.errorKeys.includes("cep") ? {borderColor: "red"} : null}
        buttonClick={cepButtonClick}
        value={props.item.address.cep}
        onChange={onChange}
      />
      <Input
        title="Cidade:"
        name="city"
        type="text"
        style={props.item.errorKeys.includes("city") ? {borderColor: "red"} : null}
        value={props.item.address.city}
        onChange={onChange}
      />
      <Input
        title="Estado:"
        type="select"
        name="state"
        style={props.item.errorKeys.includes("state") ? {borderColor: "red"} : null}
        onChange={onChange}
        value={props.item.address.state}>
        {tools.states.map((item, i) => {
          return <option key={i} value={item}>{item}</option>
        })}
      </Input>
      <Input
        title="Número:"
        name="number"
        type="number"
        style={props.item.errorKeys.includes("number") ? {borderColor: "red"} : null}
        value={props.item.address.number}
        onChange={onChange}
      />
      <Input
        title="Complemento:"
        name="additional"
        type="text"
        value={props.item.address.additional}
        onChange={onChange}
      />
    </Block>
  )
}