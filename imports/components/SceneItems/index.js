import React from 'react';
import tools from '/imports/startup/tools/index';
import Table from './Table/index';
import ManageItems from './ManageItems/index';

export default class SceneItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false
    }
  }
  toggleWindow = (windowOpen) => {
    if (!this.props.disabled) {
      this.setState({
        windowOpen: this.state.windowOpen ? false : windowOpen
      });
    }
  }
  render() {
    return (
      <div className="master__items">
        <div className="master__list">
          <h3>Containers:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.master.containers}
            toggleWindow={() => this.toggleWindow('containers')}
          />
        </div>
        <div className="master__list">
          <h3>Acessórios:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.master.accessories}
            toggleWindow={() => this.toggleWindow('accessories')}
          />
        </div>
        <div className="master__list">
          <h3>Serviços:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.master.services}
            toggleWindow={() => this.toggleWindow('services')}
          />
        </div>
        {this.state.windowOpen ?
          <ManageItems
            key={this.props.master.version}
            type={this.state.windowOpen}
            toggleWindow={this.toggleWindow}
            fullDatabase={this.props.databases[this.state.windowOpen+"Database"]}
            master={this.props.master}
            updateMaster={this.props.updateMaster}
          />
        : null}
      </div>
    )
  }
}