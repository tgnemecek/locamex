import React from 'react';

import customTypes from '/imports/startup/custom-types';

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

  totalItems = () => {
    var containers = this.props.contract.containers;
    var services = this.props.contract.services;
    var accessories = this.props.contract.accessories;
    return containers.concat(services, accessories);
  }

  render() {
    return(
      <div className="contract__body--middle">
        <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Containers:</strong></label>
          <ItemList
            contract={this.props.contract}
            addedItems={this.props.contract.containers}
            database="containers"
            onClick={this.toggleProductSelection}/>
        </div>
        {/* <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Acessórios:</strong></label>
          <ItemList addedItems={this.props.contract.accessories} database="accessories" onClick={this.toggleProductSelection}/>
          {this.state.accessoriesSelectionOpen ? <ProductSelection
                                                database="accessories"
                                                addedItems={this.props.contract.accessories}
                                                saveEdits={this.updateTable}
                                                closeProductSelection={this.toggleProductSelection}
                                                /> : null}
        </div>
        <div className="contract__list">
          <label onClick={this.toggleProductSelection}><strong>Serviços:</strong></label>
          <ItemList addedItems={this.props.contract.services} database="services" onClick={this.toggleProductSelection}/>
          {this.state.servicesSelectionOpen ? <ProductSelection
                                                database="services"
                                                addedItems={this.props.contract.services}
                                                saveEdits={this.updateTable}
                                                closeProductSelection={this.toggleProductSelection}
                                                /> : null}
        </div> */}
        <div>
          {customTypes.format(this.totalItems(), 'currency')}
        </div>
      </div>
    )
  }
}