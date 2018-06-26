import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class List extends React.Component {

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

  render () {
    return (
      <table className="list-view__table">
        <tbody>
          <tr className="list-view-table-row">
            {this.renderHeader()}
            {this.props.createNewButton}
            <th className="list-view__right-align list-view--item-div">
            </th>
          </tr>
          {this.props.items}
          </tbody>
      </table>
    )
  }
}