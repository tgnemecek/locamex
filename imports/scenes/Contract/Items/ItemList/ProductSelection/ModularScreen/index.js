import React from 'react';

import { Packs } from '/imports/api/packs';

import customTypes from '/imports/startup/custom-types';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import CustomInput from '/imports/components/CustomInput/index';

export default class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pack: this.props.pack,
      multiplier: 1
    }
  }

  componentDidMount() {
    var pack = {};
    var moduleDatabase = this.props.moduleDatabase;
    var database = [];
    var _id;
    this.Tracker = Tracker.autorun(() => {
      Meteor.subscribe('packsPub');
      _id = Packs.find().count().toString().padStart(4, '0'); //not good. it cant know if you've added any other items to add up
    })
    if (this.props.modularScreenType == 1) { //Add New
      pack = {
        _id,
        type: "modular",
        description: this.props.pack.description,
        containerId: this.props.pack._id,
        price: this.props.pack.price,
        modules: [],
        quantity: 1
      };
      pack.modules = this.props.pack.allowedModules.map((allowedModule, i) => {
        var selected;
        var available;
        var description;
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == allowedModule) {
            available = moduleDatabase[i].available;
            selected = available > 0 ? 1 : 0;
            description = moduleDatabase[i].description;
            database.push(moduleDatabase[i]);
          }
        }
        return {_id: allowedModule, available, selected, description}
      })
    } else pack = { ...this.props.pack }
    this.setState({ pack, database });
  }

  onChange = (e) => {
    var value = Number(e.target.value);
    var index = e.target.name;
    var multiplier = 1;
    var pack = {
      ...this.state.pack,
    }
    pack.modules[index].selected = value;
    this.setState({ pack, multiplier });
  }

  renderBody = () => {
    if (!this.state.pack.modules) return null;
    return this.state.pack.modules.map((module, i) => {
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><CustomInput
                type="number"
                max={module.available}
                name={i}
                value={module.selected}
                onChange={this.onChange}/></td>
          <td>{module.available}</td>
        </tr>
      )
    })
  }

  changeMultiplier = (e) => {
    var multiplier = e.target.value;
    this.setState({ multiplier });
  }

  calculateMax = () => {
    var modules = this.state.pack.modules;
    if (!modules) return 1;
    var minorDivisible = 999;
    var division;
    for (var i = 0; i < modules.length; i++) {
      if (!modules[i].selected) continue;
      division = Number(modules[i].available) / Number(modules[i].selected);
      if (division < minorDivisible) minorDivisible = division;
    }
    return Math.floor(minorDivisible);
  }

  saveEdits = () => {
    if (this.props.modularScreenType == 1) {
      this.props.addModular(this.state.pack);
    } else {
      this.props.editModular(this.state.pack);
    }
  }

  // saveEdits = () => {
  //   var multiplier = this.state.multiplier;
  //   var pack = {
  //     ...this.state.pack
  //   }
  //   pack.modules = pack.modules.map((module) => {
  //     var selected = Number(module.selected) * Number(multiplier);
  //     return {...module, selected};
  //   })
  //   this.props.addModular(pack);
  // }

  render() {
    return(
      <Box
        title="Montagem de Container Modular:"
        closeBox={this.props.toggleModularScreen}>
        <div>
          <h4>Montando: {this.props.pack.description}</h4>
          <label>Quantidade:</label>
          <CustomInput type="number" min={1} max={this.calculateMax()} value={this.state.multiplier} onChange={this.changeMultiplier}/>
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