import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Available extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serial: '',
      place: '',
      observations: '',

      errorKeys: []
    }
  }

  count = () => {
    return this.props.item.units.reduce((acc, cur) => {
      return acc + (cur.place !== 'rented' && cur.visible);
    }, 0)
  }

  renderBody = () => {
    return this.props.item.units.map((item, i) => {
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      const onChange = (e) => {
        var value = e.target.value;
        var key = e.target.name;
        var item = {...this.props.item};
        item.units[i][key] = value;
        this.props.onChange(item);
      }
      const renderPlaces = () => {
        return this.props.placesDatabase.map((place, i) => {
          return <option key={i} value={place._id}>{place.description}</option>
        })
      }
      if (item.visible && item.place !== 'rented') {
        return (
          <tr key={i}>
            <td className="stock-visualizer__fixed__serial">{item.serial}</td>
            <td>
              <Input
                type="select"
                name="place"
                value={item.place}
                onChange={onChange}>
                {renderPlaces()}
              </Input>
            </td>
            <td>
              <Input
                type="text"
                name="observations"
                value={item.observations}
                onChange={onChange}
              />
            </td>
            <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
          </tr>
        )
      }
    })
  }

  renderNewItem = () => {
    const onChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    }
    const renderPlaces = () => {
      var placesDatabase = tools.deepCopy(this.props.placesDatabase);
      placesDatabase.unshift({
        _id: '',
        description: ''
      })
      return placesDatabase.map((place, i) => {
        return <option key={i} value={place._id}>{place.description}</option>
      })
    }
    const addNew = () => {
      var errorKeys = [];
      if (!this.state.serial) errorKeys.push('serial');
      if (!this.state.place) errorKeys.push('place');
      if (errorKeys.length) {
        this.setState({ errorKeys });
      } else {
        var item = {...this.props.item};
        item.units.push({
          _id: tools.generateId(),
          serial: this.state.serial,
          place: this.state.place,
          observations: this.state.observations,
          snapshots: [],
          visible: true
        })
        this.setState({
          serial: '',
          place: '',
          observations: '',
          errorKeys: []
        }, () => {
          this.props.onChange(item);
        })
      }
    }
    return (
      <tr>
        <td>
          <Input
            type="text"
            name="serial"
            value={this.state.serial}
            style={this.state.errorKeys.includes("serial") ? {borderColor: "red"} : null}
            onChange={onChange}
          />
        </td>
        <td className="stock-visualizer__fixed__place">
          <Input
            type="select"
            name="place"
            value={this.state.place}
            style={this.state.errorKeys.includes("place") ? {borderColor: "red"} : null}
            onChange={onChange}>
            {renderPlaces()}
          </Input>
        </td>
        <td>
          <Input
            type="text"
            name="observations"
            value={this.state.observations}
            onChange={onChange}
          />
        </td>
        <td className="table__small-column"><button onClick={addNew} className="database__table__button">+</button></td>
      </tr>
    )
  }

  render() {
    if (this.count() === 0) return null;
    return (
      <Block
        title={`Disponíveis: ${this.count()}`}
        style={{maxHeight: "500px", overflowY: "auto"}}
        columns={1}>
        <table className="table database__table">
          <thead>
            <tr>
              <th className="stock-visualizer__fixed__serial">Série</th>
              <th className="stock-visualizer__fixed__place">Pátio</th>
              <th>Observação</th>
              <th onClick={this.addNew} className="table__small-column"></th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
          <tfoot>
            {this.renderNewItem()}
          </tfoot>
        </table>
      </Block>
    )
  }
}