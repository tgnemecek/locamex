import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import StockVisualizer from '/imports/components/StockVisualizer/index';
import Box from '/imports/components/Box/index';
import Icon from '/imports/components/Icon/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class VariationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variations: tools.deepCopy(this.props.accessory.variations),
      variationToEdit: false,
      indexToEdit: false
    }
  }
  setVariation = (e) => {
    var variations = [...this.state.variations]
    var newItem = this.props.variationsList.find((item) => {
      return item._id === e.target.value;
    })
    variations[e.target.name] = {
      _id: newItem._id,
      description: newItem.description,
      type: "variation",
      observations: newItem.observations,
      from: []
    };
    this.setState({
      variations
    })
  }
  addNew = () => {
    var variations = [...this.state.variations]
    variations.push({
      _id: '',
      description: '',
      observations: '',
      variations: []
    })
    this.setState({
      variations
    })
  }
  removeVariation = (i) => {
    var variations = [...this.state.variations];
    variations.splice(i, 1);
    this.setState({
      variations
    })
  }
  update = (from, callback) => {
    var variations = [...this.state.variations];
    variations[this.state.indexToEdit].from = from;
    this.setState({ variations }, callback);
  }
  renderOptions = (variationId) => {
    return this.props.variationsList
      .filter((item) => {
        if (item._id === variationId) return true;
        return !this.state.variations.find((variation) => {
          return variation._id === item._id;
        })
      })
      .map((item, i) => {
        return (
          <option key={i} value={item._id}>
            {item.description}
          </option>
        )
      })
  }
  saveEdits = () => {
    var variations = this.state.variations;
    var accessory = {...this.props.accessory};
    variations = variations.filter((variation) => {
      return variation._id
    })
    accessory.variations = variations;
    this.props.update(accessory, this.props.toggleWindow);
  }

  renderBody = () => {
    return this.state.variations.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td className="table__wide">
            <Input
              type="select"
              name={i}
              value={item._id}
              onChange={this.setVariation}
              >
              <option value=""></option>
              {this.renderOptions(item._id)}
            </Input>
          </td>
          <td>
            {item.observations}
          </td>
          <td>
            {item._id ?
              <button onClick={() => this.setState({
                variationToEdit: item,
                indexToEdit: i
              })}>
                <Icon icon="transaction"/>
              </button>
            : null}
          </td>
          <td>
            {item.from && item.from.length ?
              <span style={{color: 'green'}}>✔</span>
            : <span style={{color: 'red'}}>⦸</span>}
          </td>
          <td>
            <button onClick={() => this.removeVariation(i)}>
              <Icon icon="not"/>
            </button>
          </td>
        </tr>
      )
    })
  }
  render() {
    return (
      <Box
        title="Seleção de Acessório"
        closeBox={this.props.toggleWindow}>
        <h4>
          {this.props.accessory.description}
        </h4>
        <div className="variation-list__scroll">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th className="table__wide">Variações</th>
                <th>Observações</th>
                <th>Seleção</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <td className="variation-list__add-new">
                <button onClick={this.addNew}>
                  Adicionar Grupo de Acessórios
                </button>
              </td>
            </tr>
          </tbody>
        </table>
          <FooterButtons buttons={[
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Salvar",
            className: "button--primary",
            onClick: this.saveEdits}
          ]}/>
          {this.state.variationToEdit ?
            <this.props.StockTransition
              update={this.update}
              title={`Acessório: ${this.props.accessory.description}, ${this.state.variationToEdit.description}`}
              toggleWindow={() => this.setState({
                variationToEdit: false
              })}
              places={this.props.variationsList.find((item) => {
                return item._id === this.state.variationToEdit._id;
              }).places}
              max={this.props.accessory.max}
              item={this.state.variationToEdit}/>
          : null}
      </Box>
    )
  }
}