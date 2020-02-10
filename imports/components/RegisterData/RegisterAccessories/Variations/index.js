import React from 'react';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';

export default class Variations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: ''
    }
  }

  renderVariations = () => {
    return this.props.variations.map((variation, i, arr) => {

      const onChange = (e) => {
        var variations = [...this.props.variations];
        variations[i].observations = e.target.value;

        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.props.onChange(obj);
      }

      const addNewItem = () => {
        var variations = [...this.props.variations];
        variations.push({
          _id: tools.generateId(),
          description: "Padrão " + tools.convertToLetter(i+1),
          observations: this.state.observations,
          rented: 0,
          places: [],
          new: true, // This is only to allow deletion
          visible: true
        });

        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.setState({ observations: '' }, () => {
          this.props.onChange(obj);
        })
      }

      const removeItem = () => {
        var variations = [...this.props.variations];
        variations.splice(i, 1);
        for (var j = i; j < variations.length; j++) {
          variations[j].description = "Padrão " + tools.convertToLetter(j);
        }


        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.props.onChange(obj);
      }

      return (
        <tr key={i}>
          <td className="register-accessories__table__variations-column">
            {variation.description}
          </td>
          <td>
            <Input
              name={i}
              disabled={this.props.disabled}
              value={variation.observations}
              onChange={onChange}/>
          </td>
          {variation.new ?
            <td className="register-accessories__table__add-new-column">
              <button className="database__table__button"
                disabled={this.props.disabled}
                onClick={removeItem}>
                <Icon icon="not"/>
              </button>
            </td>
          : null}
          {i === arr.length-1 ?
            <td className="register-accessories__table__add-new-column">
              <button
                className="database__table__button"
                disabled={this.props.disabled}
                onClick={addNewItem}>
                <Icon icon="new"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  render() {
    if (this.props.variations.length < 2) return null;
    return (
      <div className="register-data__variations-block">
        <h4>Variações:</h4>
        <table className="table">
          <thead>
            <tr>
              <th className="register-accessories__table__variations-column">
                Padrão
              </th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {this.renderVariations()}
          </tbody>
        </table>
      </div>
    );
  }
}