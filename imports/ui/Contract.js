import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: this.props._id,
      clientId: this.props.clientId,
      type: this.props.type,
      status: this.props.status,
      createdBy: this.props.createdBy,
      creationDate: this.props.creationDate,
      startDate: this.props.startDate,
      duration: this.props.duration,
      observations: this.props.observations,
      deliveryAddress: this.props.deliveryAddress,
      products: this.props.products
    }
  }

  render () {
    return (
      <form className="contract">
        <div className="contract__header">
          <h1>Contrato #{this.props._id}</h1><h3>{this.props.status}</h3>
        </div>
      </form>
    )
  }
}