import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RegisterData from '/imports/components/RegisterData/index';

export default class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWindowOpen: false
    }
  }

  toggleClientWindow = () => {
    this.setState({ clientWindowOpen: !this.state.clientWindowOpen })
  }

  render() {
    return (
      <div>
        <h3>Informações</h3>
        <div className="billing__information">
          <Input
            title="Cliente"
            readOnly={true}
            value={this.props.client.description}
            buttonClick={this.toggleClientWindow}
          />
          <Input
            title="Proposta"
            readOnly={true}
            value={this.props.proposalId + "." + (this.props.proposalIndex+1)}
          />
        </div>
        {this.state.clientWindowOpen ?
          <RegisterData
            type='clients'
            item={this.props.client}
            toggleWindow={this.toggleClientWindow}
            disabled={true}
          />
        : null}
      </div>
    )
  }
}