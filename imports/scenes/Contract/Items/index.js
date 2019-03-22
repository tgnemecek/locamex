import React from 'react';
import tools from '/imports/startup/tools/index';
import ManageItems from './ManageItems/index';

export default class Items extends React.Component {
  render() {
    return(
      <div className="contract__items">
        <div className="contract__list">
          <h3>Containers:</h3>
          <ManageItems
            fullDatabase={this.props.databases.containersDatabase}
            contract={this.props.contract}
            updateContract={this.props.updateContract}
            type="containers"
          />
        </div>
        <div className="contract__list">
          <h3>Acessórios:</h3>
          <ManageItems
            fullDatabase={this.props.databases.accessoriesDatabase}
            contract={this.props.contract}
            updateContract={this.props.updateContract}
            type="accessories"
          />
        </div>
        <div className="contract__list">
          <h3>Serviços:</h3>
          <ManageItems
            fullDatabase={this.props.databases.servicesDatabase}
            contract={this.props.contract}
            updateContract={this.props.updateContract}
            type="services"
          />
        </div>
      </div>
    )
  }
}