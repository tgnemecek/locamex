import React from 'react';
import { Meteor } from 'meteor/meteor';

import EditClient from './EditClient';
import SortButton from './SortButton';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      createOpen: false,
      itemIndex: 0
    }
  };

  editWindow = () => {
    if (!this.props.type) return null;

    let props = {};

    switch (this.props.type) {
      case "clients":
        this.createNewButton = <th><EditClient key={0} formType="company" createNew={true}/></th>
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

  createWindow = () => {
    switch (this.props.type) {
      case 'clients':
        return <EditClient editOpen={this.state.createOpen} closeEditWindow={this.closeEditWindow} createNew={true}/>
        break;
    }
  }

  openEditWindow = (e) => {
    this.setState({editOpen: true, itemIndex: e.target.value});
  }

  openCreateWindow = (e) => {
    this.setState({createOpen: true});
  }

  closeEditWindow = () => {
    this.setState({editOpen: false, createOpen: false});
  }

  setClassName = () => {
    let className = 'table ';
    switch (this.props.type) {
      case 'clients':
        className += 'table--clients'
        break;
    }
    return className;
  }

  renderHeader = () => {
    return this.props.header.map((header, i, array) => {
      return (
        <th key={i}>
          {header.title}
          {header.enableSort ? <SortButton
                                      database={this.props.database}
                                      sortItems={this.props.sortItems}
                                      itemValue={header.value}/> : null}
        </th>
      )
    })
  }

  renderBody = (e) => {
    if (this.props.database.length > 0) {
      return this.props.database.map((item, index) => {
        return (
          <tr key={index}>
            <td>{item._id}</td>
            <td>{item.clientName}</td>
            <td>{item.type == 'company' ? "PJ" : "PF"}</td>
            <td>
              <button className="button--pill button--list" value={index} onClick={this.openEditWindow}>Editar</button>
            </td>
          </tr>

        )
      })
    }
  }

  render () {
    return (
      <div>
        <table className={this.setClassName()}>
          <tbody>
            <tr>
              {this.renderHeader()}
              <th>
                <button className="button--pill button--list" onClick={this.openCreateWindow}>+</button>
              </th>
            </tr>
            {this.renderBody()}
            </tbody>
        </table>
        {this.state.editOpen ? this.editWindow() : null}
        {this.state.createOpen ? this.createWindow() : null}
      </div>
    )
  }
}