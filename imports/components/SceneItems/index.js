import React from 'react';
import tools from '/imports/startup/tools/index';
import ManageItems from './ManageItems/index';

export default class SceneItems extends React.Component {
  render() {
    return(
      <div className="master__items">
        <div className="master__list">
          <h3>Containers:</h3>
          <ManageItems
            key={this.props.master.version}
            fullDatabase={this.props.databases.containersDatabase}
            master={this.props.master}
            updateMaster={this.props.updateMaster}
            type="containers"
            title="Containers"
          />
        </div>
        <div className="master__list">
          <h3>Acessórios:</h3>
          <ManageItems
            key={this.props.master.version}
            fullDatabase={this.props.databases.accessoriesDatabase}
            master={this.props.master}
            updateMaster={this.props.updateMaster}
            type="accessories"
            title="Acessórios"
          />
        </div>
        <div className="master__list">
          <h3>Serviços:</h3>
          <ManageItems
            key={this.props.master.version}
            fullDatabase={this.props.databases.servicesDatabase}
            master={this.props.master}
            updateMaster={this.props.updateMaster}
            type="services"
            title="Serviços"
          />
        </div>
      </div>
    )
  }
}