import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class SendSeries extends React.Component {
  componentDidMount() {
    var filter = this.props.snapshot.containers
      .filter((item) => {
        return item.type === "fixed";
      })
    var series = [];
    filter.forEach((fixed) => {
      for (var i = 0; i < fixed.renting; i++) {
        series.push({
          _id: '',
          container: {
            _id: fixed._id,
            description: fixed.description
          }
        })
      }
    })
    this.props.update({ series });
  }

  renderOptions = (itemId, containerId) => {
    return this.props.seriesDatabase.filter((item) => {
      return item.container._id === containerId;
    }).filter((item) => {
      if (item._id === itemId) return true;
      return !this.props.series.find((series) => {
        return series._id === item._id
      })
    }).map((item, i) => {
      return (
        <option key={i} value={item._id}>
          {`Série: ${item._id}. Pátio: ${item.place.description}`}
        </option>
      )
    })
  }

  onChange = (e) => {
    var series = [...this.props.series];
    var newItem = this.props.seriesDatabase.find((item) => {
      return item._id === e.target.value;
    })
    var i = e.target.name;
    series[i] = newItem || {
      _id: '',
      container: {
        _id: series[i].container._id,
        description: series[i].container.description
      }
    }
    this.props.update({ series });
  }

  renderBody = () => {
    return this.props.series.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td style={{width: "110px"}}>
            {item.container.description}
          </td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={this.onChange}
              value={item._id}>
                <option value=''>Selecione uma série</option>
                {this.renderOptions(item._id, item.container._id)}
            </Input>
          </td>
          <td>
            {item._id ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>⦸</span>}
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
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Produto</th>
                <th className="table__wide">Série</th>
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