import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class Filter extends React.Component {
  onChange = (e) => {
    var value = e.target.value;
    this.props.setFilter(this.props.field, value);
  }

  renderOptions = () => {
    var databaseToUse;
    if (this.props.field === 'place') {
      databaseToUse = this.props.placesDatabase;
    } else if (this.props.field === 'model') {
      databaseToUse = this.props.modelsDatabase;
    } else throw new Error('add-to-filterbar-renderoptions');
    return databaseToUse.map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    });
  }

  renderTitle = () => {
    if (this.props.field === 'place') return 'Pátio:';
    if (this.props.field === 'model') return 'Modelo:';
  }

  render() {
    return (
      <Input
        title={this.renderTitle()}
        type="select"
        onChange={this.onChange}>
        <option value="" style={{fontStyle: "italic"}}>Mostrar Tudo</option>
        {this.renderOptions()}
      </Input>
    )
  }
}