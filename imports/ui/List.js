import React from 'react';
import { Meteor } from 'meteor/meteor';

//props:
//header (array of objects) --- obj: {title, styleObject}
//editButton bool
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: []
    }
  }

  renderSortButtons = (i) => {
    if (i == this.props.header.length && this.props.editButton) {
      return (
        <div className="list-view__sort-div">
          <button>⯅</button>
          <button>⯆</button>
        </div>
      )
    } else return null
  }

  renderTh = () => {
    this.props.header.map((header, i, array) => {
      return (
        <th className="list-view__left-align list-view--item-div" style={header.style}>
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
            {this.renderTh()}
            <th className="list-view__right-align list-view--item-div">
              <ClientItem key={0} formType="company" createNew={true}/>
            </th>
          </tr>
          {this.renderClients()}
          </tbody>
      </table>
    )
  }
}