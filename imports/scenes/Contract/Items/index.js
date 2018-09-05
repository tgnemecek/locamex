import React from 'react';

import tools from '/imports/startup/tools/index';

import ItemList from './ItemList/index';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containersSelectionOpen: false,
      accessoriesSelectionOpen: false,
      servicesSelectionOpen: false,

      containers: this.props.contract.containers,
      accessories: this.props.contract.accessories,
      services: this.props.contract.services
    }
  }

  toggleProductSelection = (database) => {
    if (this.state.containersSelectionOpen || this.state.accessoriesSelectionOpen || this.state.servicesSelectionOpen) {
      this.setState({ containersSelectionOpen: false });
      this.setState({ accessoriesSelectionOpen: false });
      this.setState({ servicesSelectionOpen: false });
    } else switch (database) {
      case 'containers':
        this.setState({ containersSelectionOpen: true });
        break;
      case 'accessories':
        this.setState({ accessoriesSelectionOpen: true });
        break;
      case 'services':
        this.setState({ servicesSelectionOpen: true });
        break;
    }
  }

  render() {
    return(
      <div className="contract__items">
        <div className="contract__list">
          <h3 onClick={this.toggleProductSelection}>Containers:</h3>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="containers"
            onClick={this.toggleProductSelection}/>
        </div>
        <div className="contract__list">
          <h3 onClick={this.toggleProductSelection}>Acessórios:</h3>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="accessories"
            onClick={this.toggleProductSelection}/>
        </div>
        <div className="contract__list">
          <h3 onClick={this.toggleProductSelection}>Serviços:</h3>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="services"
            onClick={this.toggleProductSelection}/>
        </div>
      </div>
    )
  }
}