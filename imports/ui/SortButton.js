import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class SortButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regularOrder: true
    }
  }

  onClick = (e) => {
    this.props.sortItems(e.target.value, this.state.regularOrder);
    this.setState({ regularOrder: !this.state.regularOrder });
  }

  render () {
    return <button onClick={this.onClick} value={this.props.itemValue} className="button--sort">⬍</button>
  }
}