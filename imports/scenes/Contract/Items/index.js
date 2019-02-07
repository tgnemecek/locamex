import React from 'react';

import tools from '/imports/startup/tools/index';

import AddedContainers from './AddedContainers/index';
import AddedAccessories from './AddedAccessories/index';
import AddedServices from './AddedServices/index';

export default class Items extends React.Component {
  render() {
    return(
      <div className="contract__items">
        <div className="contract__list">
          <h3>Containers:</h3>
          <AddedContainers
            updateContract={this.props.updateContract}
            contract={this.props.contract}/>
          {/* <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            dbName="containers"
            onClick={this.toggleProductSelection}/> */}
        </div>
        <div className="contract__list">
          <h3>Acessórios:</h3>
          <AddedAccessories
            updateContract={this.props.updateContract}
            contract={this.props.contract}/>
        </div>
        <div className="contract__list">
          <h3>Serviços:</h3>
          <AddedServices
            updateContract={this.props.updateContract}
            contract={this.props.contract}/>
          {/* <ItemList
            updateContract={this.props.updateContract}
            contract={this.props.contract}
            dbName="services"
            onClick={this.toggleProductSelection}/> */}
        </div>
      </div>
    )
  }
}