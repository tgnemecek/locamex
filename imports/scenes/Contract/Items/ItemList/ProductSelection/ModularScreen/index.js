import React from 'react';
import { Modules } from '/imports/api/modules';

import customTypes from '/imports/startup/custom-types';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import CustomInput from '/imports/components/CustomInput/index';

export default class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: [],
      quantity: 1
    }
  }

  componentDidMount() {
    var preDatabase = customTypes.deepCopy(this.props.moduleDatabase);
    var database = [];
    var container = this.props.container;
    calculateModulesInitialValues = (_id) => {
      var container = this.props.container;
      var modules = container.modules;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i]._id == _id) {
          return modules[i].selected;
        }
      }
    }
    container.allowedModules.forEach((module, i) => {
      for (var j = 0; j < preDatabase.length; j++) {
        if (preDatabase[j]._id == module) {
          if (this.props.modularScreenType == 2) {
            preDatabase[j].selected = calculateModulesInitialValues(preDatabase[j]._id);
          } else preDatabase[j].selected = preDatabase[j].available > 0 ? 1 : 0;
          database.push(preDatabase[j]);
          break;
        }
      }
    })
    this.setState({ database });
  }

  changeQuantity = (e) => {
    var quantity = e.target.value;
    this.setState({ quantity });
  }

  calculateMax = () => {
    var database = this.state.database;
    var minorDivisible = 999;
    var division;
    for (var i = 0; i < database.length; i++) {
      if (!database[i].selected) continue;
      division = Number(database[i].available) / Number(database[i].selected);
      if (division < minorDivisible) minorDivisible = division;
    }
    return Math.floor(minorDivisible);
  }

  onChange = (e) => {
    var i = Number(e.target.name);
    var value = Number(e.target.value);
    var quantity = 1;
    var database = customTypes.deepCopy(this.state.database);
    database[i].selected = value;
    this.setState({ database, quantity });
  }

  saveEdits = () => {
    var database = customTypes.deepCopy(this.state.database);
    database.forEach((module) => {
      if (module.selected) {
        module.selected = module.selected * this.state.quantity;
      } else module.selected = 0;
    })
    this.props.addModular(database);
  }

  removeItem = () => {
    this.props.toggleModularScreen();
  }

  renderBody = () => {
    return this.state.database.map((module, i) => {
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><CustomInput
                type="number"
                max={module.available}
                name={i}
                value={this.state.database[i].selected}
                onChange={this.onChange}/></td>
          <td>{module.available}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <Box
        title="Montagem de Container Modular:"
        closeBox={this.props.toggleModularScreen}>
        <div>
          <label>Quantidade:</label>
          <CustomInput type="number" min={1} max={this.calculateMax()} value={this.state.quantity} onChange={this.changeQuantity}/>
        </div>
        <table className="table table--modular-screen">
          <thead>
            <tr>
              <th>Código</th>
              <th>Componentes</th>
              <th>Qtd.</th>
              <th>Disp.</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        <FooterButtons buttons={[
          {text: "Remover", className: "button--danger", onClick: () => this.props.removeItem()},
          {text: "Salvar", onClick: () => this.saveEdits()}
        ]}/>
      </Box>
    )
  }
}