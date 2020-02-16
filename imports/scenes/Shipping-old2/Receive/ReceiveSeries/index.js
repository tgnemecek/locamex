import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

export default class ReceiveSeries extends React.Component {
  componentDidMount() {
    var series = this.props.currentlyRented.series.map((item) => {
      return {
        ...item,
        place: {}
      }
    })
    this.props.update({ series });
  }

  renderOptions = () => {
    return this.props.placesDatabase.map((place, i) => {
      return (
        <option key={i} value={place._id}>
          {place.description}
        </option>
      )
    })
  }

  onChange = (e) => {
    var series = [...this.props.series];
    var _id = e.target.value;
    var i = e.target.name;
    var place;
    if (!_id) {
      place = {};
    } else {
      place = this.props.placesDatabase.find((item) => {
        return item._id === _id;
      })
    }
    series[i].place = {
      _id: place._id,
      description: place.description
    }
    this.props.update({ series });
  }

  renderBody = () => {
    return this.props.series.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>
            {item.container.description}
          </td>
          <td>
            {item.description}
          </td>
          <td className="table__wide">
            <Input
              type="select"
              name={i}
              onChange={this.onChange}
              value={item.place._id}>
                <option value=''></option>
                {this.renderOptions()}
            </Input>
          </td>
          <td className="no-padding">
            {item.place._id
              ? <Icon icon="checkmark" color="green"/>
              : <Icon icon="not" color="red"/>
            }
          </td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.series.length > 0) {
      return (
        <div>
          <h4>Containers Fixos</h4>
          <table className="table shipping__receive-receive-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Produto</th>
                <th>Série</th>
                <th className="table__wide">Pátio</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      )
    } else return null;
  }
}