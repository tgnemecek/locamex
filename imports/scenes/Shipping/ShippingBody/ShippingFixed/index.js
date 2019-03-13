import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class ShippingFixed extends React.Component {

  renderHeader = () => {
    return (
      <tr>
        <th>Modelo</th>
        <th>Série</th>
        <th>Pátio</th>
      </tr>
    )
  }

  renderBody = () => {
    const renderOptions = (_id) => {
      var filtered = this.props.seriesDatabase.filter((item) => {
        return (item.model === _id && item.place !== 'rented');
      })
      return filtered.map((item, i) => {
        <option key={i} value={item._id}>{`Série: ${item.serial} - Pátio: ${item.place}`}</option>
      })
    }

    const onChange = (e) => {
      var fixed = tools.deepCopy(this.props.fixed);
      var index = e.target.name;
      fixed[index] = e.target.value;
      this.props.onChange({ fixed });
    }

    const getDescription = (model) => {
      var container = this.props.containersDatabase.find((item) => {
        return item._id === model;
      });
      return container ? container.description : null;
    }

    return this.props.fixed.map((item, i) => {
      return (
        <tr key={i}>
          <td>{getDescription(item.model)}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item._id}>
                {renderOptions(item._id)}
            </Input>
          </td>
          <td>PÁTIO</td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.fixed.length > 0) {
      return (
        <Block columns={1} title="Containers Fixos">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </Block>
      )
    } else return null;
  }
}