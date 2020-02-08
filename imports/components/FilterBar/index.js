import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

export default class FilterBar extends React.Component {
  onClick = () => {
    this.props.onChange({
      target: {
        value: '',
        name: this.props.name
      }
    });
  };
  render() {
    return (
      <div className="filter-bar">
        <Input {...this.props}/>
        <button className="filter-bar__button" onClick={this.onClick}>
          <Icon icon="not"/>
        </button>
      </div>
    )
  }
}