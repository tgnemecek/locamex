import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Places } from '/imports/api/places/index';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class StockPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: this.props.contract
    }
  }

  getPlaceName = (placeId) => {
    var placesDatabase = this.props.database;
    for (var i = 0; i < placesDatabase.length; i++) {
      if (placesDatabase[i]._id === placeId) {
        return placesDatabase[i].description;
      }
    }
    return "erro!";
  }

  displayFixed = () => {
    var containers = tools.deepCopy(this.state.contract.containers);
    var jsxArray = [
      <tr key="subheader">
        <td>Containers Fixos</td>
        <td></td>
      </tr>
    ];

    for (var i = 0; i < containers.length; i++) {
      if (containers[i].type === "fixed") {
        jsxArray.push(
          <tr key={i}>
            <td>{containers[i].description}</td>
            <td>{this.getPlaceName(containers[i].place)}</td>
          </tr>
        )
      }
    }
    return jsxArray.length === 1 ? null : jsxArray;
  }

  displayPacks = () => {
    var containers = tools.deepCopy(this.state.contract.containers);
    var jsxArray = [
      <tr key="subheader">
        <td>Pacotes Montados</td>
        <td></td>
      </tr>
    ];

    for (var i = 0; i < containers.length; i++) {
      if (containers[i].type === "pack") {
        jsxArray.push(
          <tr key={i}>
            <td>{containers[i].description}</td>
            <td>{containers[i].place + "_disabled input"}</td>
          </tr>
        )
      }
    }
    return jsxArray.length === 1 ? null : jsxArray;
  }

  displayModules = () => {
    var containers = tools.deepCopy(this.state.contract.containers);
    var moduleArray = [];
    var jsxArray = [
      <tr key="subheader">
        <td>Componentes</td>
        <td></td>
      </tr>
    ];

    for (var i = 0; i < containers.length; i++) {
      if (containers[i].type === "modular") {
        containers[i].modules.forEach((module) => {
          var added = false;
          for (var j = 0; j < moduleArray.length; j++) {
            if (moduleArray[j]._id === module._id) {
              moduleArray[j].selected = moduleArray[j].selected + module.selected;
              added = true;
            }
          }
          if (!added) {
            moduleArray.push(module);
          }
        })
      }
    }

    for (var i = 0; i < moduleArray.length; i++) {
      jsxArray.push(
        <tr key={i}>
          <td>{moduleArray[i].description}</td>
          <td>{moduleArray[i].place}</td>
        </tr>
      )
    }

    return jsxArray.length === 1 ? null : jsxArray;
  }

  displayAccessories = () => {
    return null;
  }

  render() {
    return (
      <Box
        title="Selecione os Itens:"
        closeBox={this.props.toggleWindow}>
        <table className="table contract__item-list__table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Pátio</th>
            </tr>
          </thead>
          <tbody>
            {this.displayFixed()}
            {this.displayPacks()}
            {this.displayModules()}
            {this.displayAccessories()}
          </tbody>
        </table>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
          {text: "Confirmar e Locar", onClick: () => this.toggleStockPicker()}
        ]}/>
      </Box>
    )
  }
}

export default StockPickerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var database = Places.find().fetch();
  var ready = !!database.length;
  return {
    database,
    ready
  }
})(StockPicker);