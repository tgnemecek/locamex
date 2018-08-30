import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function Fixed (props) {
  const onChange = () => {

  }
  const renderOptions = (database) => {
    return props.item[database].map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  return (
    <Block columns={2} className="register-containers__fixed-block">
      <Input
        title="Pátio:"
        type="select"
        name="place"
        value={props.place}
        onChange={onChange}>
          {renderOptions("placesDatabase")}
      </Input>
      <Input
        title="Status:"
        type="select"
        name="status"
        value={props.place}
        onChange={onChange}>
          <option value="available">Disponível</option>
          <option value="maintenance">Manutenção</option>
          <option value="inactive">Inativo</option>
      </Input>
    </Block>
  )
}