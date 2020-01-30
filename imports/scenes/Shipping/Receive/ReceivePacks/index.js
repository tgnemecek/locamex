import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class ReceivePacks extends React.Component {
  renderHeader = () => {
    return (
      <tr>
        <th>#</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Destino</th>
      </tr>
    )
  }

  renderBody = () => {
    const renderPlaces = () => {
      return this.props.placesDatabase.map((place, i) => {
        return <option key={i} value={place._id}>{place.description}</option>
      })
    }

    const onChange = (e) => {
      var place = e.target.value;
      var modules = [...this.props.modules];
      var index = e.target.name;
      modules[index].place = place;
      this.props.onChange({ modules });
    }

    return this.props.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td>{item.description}</td>
          <td>{item.selected}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item.place}>
                <option value="">Selecione um pátio</option>
                {renderPlaces()}
            </Input>
          </td>
          <td className="table__small-column">
            {item.place ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>⦸</span>}
          </td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.modules.length > 0) {
      return (
        <Block columns={1} title="Componentes">
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