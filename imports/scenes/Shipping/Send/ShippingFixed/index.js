import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class ShippingFixed extends React.Component {
  renderHeader = () => {
    return (
      <tr>
        <th className="table__small-column">#</th>
        <th className="table__small-column">Produto</th>
        <th>Série</th>
      </tr>
    )
  }

  renderBody = () => {
    const renderOptions = (productId, currentId) => {
      var filtered = this.props.seriesDatabase.filter((itemFromDatabase) => {
        if (itemFromDatabase.containerId === productId && itemFromDatabase.place !== 'rented') {
          return !this.props.fixed.find((itemAdded) => {
            if (itemAdded.seriesId === itemFromDatabase._id) {
              return (currentId !== itemAdded._id)
            } else return false;
          })
        }
      })
      return filtered.map((item, i) => {
        return (
          <option
            key={i}
            value={item._id}>{`Série: ${item._id} - Pátio: ${tools.findUsingId(this.props.placesDatabase, item.place).description}`}
          </option>
        )
      })
    }

    const onChange = (e) => {
      var seriesId = e.target.value;
      var fixed = [...this.props.fixed];
      var index = e.target.name;
      fixed[index].seriesId = seriesId;
      this.props.onChange({ fixed });
    }

    return this.props.fixed.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td style={{width: "110px"}}>{item.description}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item.seriesId}>
                <option value="">Selecione uma série</option>
                {renderOptions(item.productId, item._id)}
            </Input>
          </td>
          <td className="table__small-column">
            {item.seriesId ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>⦸</span>}
          </td>
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