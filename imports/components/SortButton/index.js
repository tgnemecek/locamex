import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export default class SortButton extends React.Component {
  onClick = (e) => {
    var order = e.target.value;
    var database = [...this.props.database];
    var attribute = this.props.attribute;
    if (typeof(database[0][attribute] === 'number')) {
      database.sort(function(a, b){return a - b});
    } else database.sort();
    // if (order) database.reverse(); //This can be added later for two-buttons functionality
    this.props.returnSort(database);
  }
  render () {
    return (
      <div className="sort-button">
        <button onClick={this.onClick} value={true}>⬘</button>
      </div>
    )
  }
}