import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function Fixed (props) {
  const renderPlaces = (database) => {
    return props.item.placesDatabase.map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  return (
    <Block columns={1} className="register-containers__fixed-block">
      <Input
        title="Observações:"
        type="text"
        name="observations"
        value={props.item.observations}
        onChange={props.onChange}/>
    </Block>
  )
}