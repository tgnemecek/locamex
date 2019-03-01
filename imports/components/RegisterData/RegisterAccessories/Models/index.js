import React from 'react';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class Models extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: ''
    }
  }

  renderModels = () => {
    return this.props.models.map((model, i) => {

      const onChange = (e) => {
        var models = tools.deepCopy(this.props.models);
        models[i].observations = e.target.value;

        var obj = {target: {
          value: models,
          name: 'models'
        }}
        this.props.onChange(obj);
      }

      return (
        <tr key={i}>
          <td className="register-accessories__table__models-column">Modelo {tools.convertToLetter(i)}</td>
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
    if (this.props.models.length > 25) return null;

    const onChangeNewItem = (e) => {
      this.setState({ observations: e.target.value })
    }

    const addNewItem = () => {
      var models = tools.deepCopy(this.props.models);
      models.push({
        observations: this.state.observations,
        place: [],
        visible: true
      });

      var obj = {target: {
        value: models,
        name: 'models'
      }}
      this.setState({ observations: '' }, () => {
        this.props.onChange(obj);
      })
    }

    return (
      <tr>
        <td className="register-accessories__table__models-column">Novo Modelo</td>
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
    if (!this.props.models) return null;
    return (
      <Block
        title="Modelos:"
        className="register-data__models-block"
        columns={1}>
        <table className="table">
          <thead>
            <tr>
              <th className="register-accessories__table__models-column">Modelo</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {this.renderModels()}
          </tbody>
          <tfoot>
            {this.renderAddNew()}
          </tfoot>
        </table>
      </Block>
    );
  }
}