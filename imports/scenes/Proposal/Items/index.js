import React from 'react';
import tools from '/imports/startup/tools/index';
import ManageItems from './ManageItems/index';

export default class Items extends React.Component {
  render() {
    return(
      <div className="proposal__items">
        <div className="proposal__list">
          <h3>Containers:</h3>
          <ManageItems
            fullDatabase={this.props.databases.containersDatabase}
            proposal={this.props.proposal}
            updateProposal={this.props.updateProposal}
            type="containers"
            title="Containers"
          />
        </div>
        <div className="proposal__list">
          <h3>Acessórios:</h3>
          <ManageItems
            fullDatabase={this.props.databases.accessoriesDatabase}
            proposal={this.props.proposal}
            updateProposal={this.props.updateProposal}
            type="accessories"
            title="Acessórios"
          />
        </div>
        <div className="proposal__list">
          <h3>Serviços:</h3>
          <ManageItems
            fullDatabase={this.props.databases.servicesDatabase}
            proposal={this.props.proposal}
            updateProposal={this.props.updateProposal}
            type="services"
            title="Serviços"
          />
        </div>
      </div>
    )
  }
}