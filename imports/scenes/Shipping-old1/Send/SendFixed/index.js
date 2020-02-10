import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class SendFixed extends React.Component {
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
        if (itemFromDatabase.containerId === productId && itemFromDatabase.placeId !== 'rented') {
          return !this.props.fixed.find((itemAdded) => {
            if (itemAdded._id === itemFromDatabase._id) {
              return (currentId !== itemAdded._id)
            } else return false;
          })
        }
      })
      return filtered.map((item, i) => {
        return (
          <option
            key={i}
            value={item._id}>{`Série: ${item._id} - Pátio: ${item.placeDescription}`}
          </option>
        )
      })
    }

    return this.props.fixed.map((item, i) => {
      const onChange = () => {
        var fixed = [...this.props.fixed];
        fixed[i]._id = _id;
        if (_id === "") {
          fixed[index].placeId = "";
          fixed[index].placeDescription = "";
        } else {
          this.props.seriesDatabase.find((item) => {
            if (item._id === seriesId) {
              fixed[index].placeId = item.placeId;
              fixed[index].placeDescription = this.props.placesDatabase.find((place) => {
                return place._id === item.placeId;
              }).description;
              return true;
            }
          });
        }
        this.props.onChange({ fixed });
      }

      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td style={{width: "110px"}}>{item.containerDescription}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item._id}>
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
        <div>
          <h4>Containers Fixos</h4>
          <table className="table">
            <thead>
              {this.renderHeader()}
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