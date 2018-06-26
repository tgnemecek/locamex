import React from 'react';
import { Meteor } from 'meteor/meteor';

import EditClient from './EditClient';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      itemIndex: []
    }
    // this.createNewButton = <th><ClientItem key={0} formType="company" createNew={true}/></th>
  };

  editWindow = () => {
    if (!this.props.type) return null;

    let props = {};

    switch (this.props.type) {
      case "clients":
        return (
          <EditClient
            editOpen={this.state.editOpen}
            closeEditWindow={this.closeEditWindow}

            _id={this.props.database[this.state.itemIndex]._id}
            createNew={false}
            clientName={this.props.database[this.state.itemIndex].clientName}
            officialName={this.props.database[this.state.itemIndex].officialName}
            cnpj={this.props.database[this.state.itemIndex].cnpj}
            registryES={this.props.database[this.state.itemIndex].registryES}
            registryMU={this.props.database[this.state.itemIndex].registryMU}
            formType={this.props.database[this.state.itemIndex].type}
            observations={this.props.database[this.state.itemIndex].observations}
            contacts={this.props.database[this.state.itemIndex].contacts}
            />
        );
        break;
    }
  }

  openEditWindow = (e) => {
    this.setState({editOpen: true, itemIndex: e.target.value});
  }

  closeEditWindow = () => {
    this.setState({editOpen: false});
  }

  renderSortButtons = (i) => {
    if (i !== this.props.header.length || this.props.editMethod == undefined) {
      return (
        <div className="list-view__sort-div">
          <button>⯅</button>
          <button>⯆</button>
        </div>
      )
    } else return null
  }

  renderHeader = () => {
    return this.props.header.map((header, i, array) => {
      return (
        <th key={i} className="list-view__left-align list-view--item-div" style={header.style}>
          {header.title}
          {this.renderSortButtons(i)}
        </th>
      )
    })
  }

  renderItems = (e) => {
    if (this.props.database.length > 0) {
      return this.props.database.map((item, index) => {
        return (
          <tr className="list-view-table-row" key={index}>
            <td className="list-view__left-align list-view--item-div">{item._id}</td>
            <td className="list-view__left-align list-view--item-div flex-grow-1">{item.clientName}</td>
            <td className="list-view__right-align list-view--item-div">
              <button className="button--pill list-view__button" value={index} onClick={this.openEditWindow}>Editar</button>
            </td>
          </tr>

        )
        // return <ClientItem
        //   key={client.index}
        //   _id={client._id}
        //   createNew={false}
        //   clientName={client.clientName}
        //   officialName={client.officialName}
        //   cnpj={client.cnpj}
        //   registryES={client.registryES}
        //   registryMU={client.registryMU}
        //   formType={client.type}
        //   observations={client.observations}
        //   contacts={client.contacts}
        // />
      })
    }
  }

  render () {
    return (
      <div>
        <table className="list-view__table">
          <tbody>
            <tr className="list-view-table-row">
              {this.renderHeader()}
              {this.props.createNewButton}
              <th className="list-view__right-align list-view--item-div">
              </th>
            </tr>
            {this.renderItems()}
            </tbody>
        </table>
        {this.state.editOpen ? this.editWindow() : null}
      </div>


    )
  }
}