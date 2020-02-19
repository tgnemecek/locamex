import moment from 'moment';
import React from 'react';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

export default class Selector extends React.Component {
  getValue = () => {
    var index = this.props.entryIndex;
    var entry = this.props.entries[index];
    return entry._id
  }

  onChange = (e) => {
    var index = this.props.entries.findIndex((item) => {
      return item._id === e.target.value;
    });
    this.props.setEntryIndex(index);
  }

  renderObservations = () => {
    var index = this.props.entryIndex;
    var entry = this.props.entries[index];
    if (entry.observations) {
      return <div>{entry.observations}</div>
    } else return null;
  }

  render() {
    if (this.props.entries.length) {
      return (
        <div className="stock-visualizer__top">
          <Input
            type="select"
            onChange={this.onChange}
            value={this.props.entryIndex}
            >
            {this.props.entries.map((entry, i) => {
              return (
                <option
                  key={i}
                  value={i}>
                    {entry.description}
                </option>
              )
            })}
          </Input>
          {this.renderObservations()}
        </div>
      )
    } else return null;
  }
}