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
      <div>
        <Input {...this.props} childrenSide="right">
          <button onClick={this.onClick}>
            <Icon icon="not" color="lightGrey"/>
          </button>
        </Input>
      </div>
    )
  }
}