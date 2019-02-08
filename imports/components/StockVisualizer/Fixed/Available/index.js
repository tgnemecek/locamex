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


  renderBody = () => {
    if (!this.props.item.units.length) return null;

    const toggleImageWindow = () => {
      return;
    }
    return this.props.item.units.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.serial}</td>
          <td>{item.place}</td>
          <td>{item.observations}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
        </tr>
      )
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
        <td>
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
        <td className="table__small-column"><button onClick={addNew}>+</button></td>
      </tr>
    )
  }

  render() {
    return (
      <table className="table database__table">
        <thead>
          <tr>
            <th>Série</th>
            <th>Pátio</th>
            <th>Observação</th>
            <th onClick={this.addNew}>+</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
        <tfoot>
          {this.renderNewItem()}
        </tfoot>
      </table>
    )
  }
}