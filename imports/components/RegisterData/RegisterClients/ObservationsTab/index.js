import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class ObservationsTab extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <Block columns={1}>
          <Input
            title="Observações sobre o cliente:"
            type="textarea"
            name="observations"
            value={this.props.item.observations}
            onChange={this.props.onChange}
          />
        </Block>
      </ErrorBoundary>
    )
  }
}