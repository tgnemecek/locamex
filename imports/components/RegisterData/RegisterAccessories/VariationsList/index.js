import React from 'react';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';

export default class VariationsList extends React.Component {
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
          description: "Padrão " + tools.convertToLetter(i+1),
          observations: '',
          new: true // This is only to allow deletion
        });

        variations[0].description = "Padrão A";

        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.props.onChange(obj);
      }

      const removeItem = () => {
        var variations = [...this.props.variations];
        variations.splice(i, 1);
        if (variations.length === 1) {
          variations[0].description = "Padrão Único";
        } else {
          for (var j = i; j < variations.length; j++) {
            variations[j].description = "Padrão " + tools.convertToLetter(j);
          }
        }
        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.props.onChange(obj);
      }

      return (
        <tr key={i}>
          <td>
            {variation.description}
          </td>
          <td className="no-padding">
            <Input
              name={i}
              disabled={this.props.disabled}
              value={variation.observations}
              onChange={onChange}/>
          </td>
          {variation.new ?
            <td className="no-padding">
              <button className=""
                disabled={this.props.disabled}
                onClick={removeItem}>
                <Icon icon="not"/>
              </button>
            </td>
          : null}
          {i === arr.length-1 ?
            <td className="no-padding">
              <button
                className=""
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
    return (
      <div>
        <h4>Variações:</h4>
        <div className="register-accessories__variations-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>
                  Padrão
                </th>
                <th className="table__wide">Observações</th>
              </tr>
            </thead>
            <tbody>
              {this.renderVariations()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}