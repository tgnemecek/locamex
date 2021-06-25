import React from "react";

import tools from "/imports/startup/tools/index";
import Input from "/imports/components/Input/index";
import StockVisualizer from "/imports/components/StockVisualizer/index";
import Box from "/imports/components/Box/index";
import Icon from "/imports/components/Icon/index";
import FooterButtons from "/imports/components/FooterButtons/index";

export default class VariationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variations: this.props.variations.filter((item) => {
        return item.accessory._id === this.props.accessory._id;
      }),
      variationToEdit: false,
      indexToEdit: false,
    };
  }
  setVariation = (e) => {
    var variations = [...this.state.variations];
    var newItem =
      this.props.variationsDatabase.find((item) => {
        return item._id === e.target.value;
      }) || {};
    variations[e.target.name] = {
      ...newItem,
      places: [],
    };
    this.setState({
      variations,
    });
  };
  addNew = () => {
    var variations = [...this.state.variations];
    variations.push({
      _id: "",
      places: [],
    });
    this.setState({
      variations,
    });
  };
  removeVariation = (i) => {
    var variations = [...this.state.variations];
    variations.splice(i, 1);
    this.setState({
      variations,
    });
  };
  update = (from, callback) => {
    var variations = [...this.state.variations];
    variations[this.state.indexToEdit].places = from;
    this.setState({ variations }, callback);
  };
  renderOptions = (variationId) => {
    return this.props.variationsDatabase
      .filter((variationDB) => {
        if (variationDB.accessory._id !== this.props.accessory._id) {
          return false;
        }
        if (variationDB._id === variationId) return true;
        return !this.state.variations.find((variationState) => {
          return variationState._id === variationDB._id;
        });
      })
      .map((item, i) => {
        return (
          <option key={i} value={item._id}>
            {item.description}
          </option>
        );
      });
  };
  getPlaces = () => {
    return this.props.variationsDatabase.find((item) => {
      return item._id === this.state.variationToEdit._id;
    }).places;
  };
  getMax = () => {
    var max = this.props.accessory.max;
    var variations = this.state.variations;
    variations.forEach((variation, i) => {
      if (i !== this.state.indexToEdit) {
        var quantity = variation.places.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);
        max -= quantity;
      }
    });
    return max;
  };
  saveEdits = () => {
    var variations = [...this.state.variations];
    variations = variations.filter((variation) => {
      if (!variation._id) return false;
      return variation.places.length;
    });
    this.props.updateVariations({ variations });
  };
  renderBody = () => {
    return this.state.variations.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td className="table__wide no-padding">
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
          <td>{item.observations}</td>
          <td>
            {item.places.reduce((acc, place) => {
              return acc + place.quantity;
            }, 0)}
          </td>
          <td className="no-padding">
            {item._id ? (
              <button
                onClick={() =>
                  this.setState({
                    variationToEdit: item,
                    indexToEdit: i,
                  })
                }
              >
                <Icon icon="transaction" />
              </button>
            ) : null}
          </td>
          <td className="no-padding">
            {item.places && item.places.length ? (
              <Icon icon="checkmark" color="green" />
            ) : (
              <Icon icon="not" color="red" />
            )}
          </td>
          <td className="no-padding">
            <button onClick={() => this.removeVariation(i)}>
              <Icon icon="not" />
            </button>
          </td>
        </tr>
      );
    });
  };
  render() {
    return (
      <Box
        title="Seleção de Variações"
        className="shipping__sub-list"
        closeBox={this.props.toggleWindow}
      >
        <h4>{this.props.accessory.description}</h4>
        <div className="shipping__sub-list__scroll">
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
            <tbody>{this.renderBody()}</tbody>
          </table>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <td className="shipping__sub-list__add-new">
                <button onClick={this.addNew}>Adicionar Variação</button>
              </td>
            </tr>
          </tbody>
        </table>
        <FooterButtons
          buttons={[
            {
              text: "Voltar",
              className: "button--secondary",
              onClick: this.props.toggleWindow,
            },
            {
              text: "Salvar",
              className: "button--primary",
              onClick: this.saveEdits,
            },
          ]}
        />
        {this.state.variationToEdit ? (
          <this.props.StockTransition
            update={this.update}
            title={`Acessório: ${this.props.accessory.description}, ${this.state.variationToEdit.description}`}
            parentDescription={this.props.accessory.description}
            toggleWindow={() =>
              this.setState({
                variationToEdit: false,
              })
            }
            places={this.getPlaces()}
            max={this.getMax()}
            item={this.state.variationToEdit}
          />
        ) : null}
      </Box>
    );
  }
}