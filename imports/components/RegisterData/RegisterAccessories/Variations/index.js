import React from 'react';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class Variations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: ''
    }
  }

  renderVariations = () => {
    return this.props.variations.map((model, i) => {

      const onChange = (e) => {
        var variations = tools.deepCopy(this.props.variations);
        variations[i].observations = e.target.value;

        var obj = {target: {
          value: variations,
          name: 'variations'
        }}
        this.props.onChange(obj);
      }

      return (
        <tr key={i}>
          <td className="register-accessories__table__variations-column">Padrão {tools.convertToLetter(i)}</td>
          <td>
            <Input
              name={i}
              value={model.observations}
              onChange={onChange}/>
          </td>
        </tr>
      )
    })
  }

  renderAddNew = () => {
    if (this.props.variations.length > 25) return null;

    const onChangeNewItem = (e) => {
      this.setState({ observations: e.target.value })
    }

    const addNewItem = () => {
      var variations = tools.deepCopy(this.props.variations);
      variations.push({
        _id: tools.generateId(),
        observations: this.state.observations,
        place: [],
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

    return (
      <tr>
        <td className="register-accessories__table__variations-column">Novo Padrão</td>
        <td>
          <Input
            value={this.state.observations}
            onChange={onChangeNewItem}/>
        </td>
        <td className="register-accessories__table__add-new-column">
          <button className="database__table__button" onClick={addNewItem}>+</button>
        </td>
      </tr>
    )
  }

  render() {
    if (this.props.variations.length < 2) return null;
    return (
      <Block
        title="Variações:"
        className="register-data__variations-block"
        columns={1}>
        <table className="table">
          <thead>
            <tr>
              <th className="register-accessories__table__variations-column">Padrão</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {this.renderVariations()}
          </tbody>
          <tfoot>
            {this.renderAddNew()}
          </tfoot>
        </table>
      </Block>
    );
  }
}