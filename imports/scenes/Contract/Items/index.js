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

  totalValue = () => {
    var containers = this.props.contract.containers;
    var services = this.props.contract.services;
    var accessories = this.props.contract.accessories;
    var all = containers.concat(services, accessories);
    if (all.length == 0) return 0;
    return all.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return {
        price: acc.price + (current.price * quantity)
      }
    }).price;
  }

  render() {
    return(
      <div className="contract__body--middle">
        <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Containers:</strong></label>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="containers"
            onClick={this.toggleProductSelection}/>
        </div>
        <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Acessórios:</strong></label>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="accessories"
            onClick={this.toggleProductSelection}/>
        </div>
        <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Serviços:</strong></label>
          <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            database="services"
            onClick={this.toggleProductSelection}/>
        </div>
        <div>
          {tools.format(this.totalValue(), 'currency')}
        </div>
      </div>
    )
  }
}