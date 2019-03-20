import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class WithVariations extends React.Component {

  renderOptions = (variations) => {
    return variations.map((item, i) => {
      return <option key={i} value={item._id}>{`Padrão ${tools.convertToLetter(i)}`}</option>
    })
  }

  onChange = (e) => {
    var value = e.target.value;
    var serial = tools.findUsingId(this.props.seriesDatabase, value);
    var accessories = tools.deepCopy(this.props.accessories);
    var index = e.target.name;
    accessories[index] = serial._id ? serial : { model: this.props.accessories[index].model };
    this.props.onChange({ accessories });
  }

  canDisplayImages = (item) => {
    return (item._id && item.snapshots.length);
  }

  render() {
    return this.props.accessories.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td>{item.description}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={this.onChange}
              value={item._id}>
                <option value="">Selecione uma variação</option>
                {this.renderOptions(item.variations)}
                <option value="multiple">Multiplas Variações</option>
            </Input>
          </td>
          <td>
            <button className="database__table__button" value={i} onClick={this.toggleObservationsWindow}>⟳</button>
          </td>
          <td className="table__small-column">
            {item.observations ? <button className="database__table__button" value={i} onClick={this.toggleObservationsWindow}>⚠</button>
            : null}
          </td>
          <td className="table__small-column">
            {this.canDisplayImages(item) ? <button className="database__table__button" value={i} onClick={this.toggleImageWindow}>🔍</button> : null}
          </td>
          <td className="table__small-column">
            {item._id ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>✖</span>}
          </td>
        </tr>
      )
    })
  }
}