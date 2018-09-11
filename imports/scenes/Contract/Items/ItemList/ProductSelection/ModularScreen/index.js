import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pack: this.props.pack
    }
    var pack = {};
    var moduleDatabase = this.props.moduleDatabase;
    if (this.props.modularScreenType == 1) { //Add New
      pack = {
        type: "modular",
        description: this.props.pack.description,
        containerId: this.props.pack._id,
        price: this.props.pack.price,
        quantity: 1
      };
      pack.modules = this.props.pack.modules.map((module, i) => {
        var quantity;
        var available;
        var description;
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == module) {
            available = moduleDatabase[i].available;
            if (!quantity) quantity = available > 0 ? 1 : 0;
            description = moduleDatabase[i].description;
          }
        }
        return {_id: module, available, quantity, description}
      });
    } else if (this.props.modularScreenType == 2) { //Edit
      pack = {...this.props.pack};
      pack.modules = this.props.pack.modules.map((module, i) => {
        var quantity;
        var available;
        var description;
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == module._id) {
            quantity = module.quantity;
            available = Number(moduleDatabase[i].available) + (module.quantity * pack.quantity);
            description = moduleDatabase[i].description;
            return {_id: module._id, available, quantity, description};
          }
        }
      });
    }
    this.state.pack = pack;
  }


  renderBody = () => {
    if (!this.state.pack.modules) return null;
    return this.state.pack.modules.map((module, i) => {
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><Input
                type="number"
                max={module.available}
                name={i}
                value={module.quantity}
                onChange={this.onChange}/></td>
          <td>{module.available}</td>
        </tr>
      )
    })
  }

  changeQuantity = (e) => {
    var quantity = e.target.value;
    var pack = {...this.state.pack, quantity}
    this.setState({ pack });
  }

  onChange = (e) => {
    var value = Number(e.target.value);
    var index = e.target.name;
    var max = this.calculateMax();
    var quantity = Number(this.state.pack.quantity);
    if (quantity > max) quantity = max;
    var pack = {
      ...this.state.pack,
      quantity
    }
    pack.modules[index].quantity = value;
    this.setState({ pack });
  }

  calculateMax = () => {
    var modules = this.state.pack.modules;
    if (!modules) return 1;
    var minorDivisible = 999;
    var division;
    for (var i = 0; i < modules.length; i++) {
      if (!modules[i].quantity) continue;
      division = Number(modules[i].available) / Number(modules[i].quantity);
      if (division < minorDivisible) minorDivisible = division;
    }
    return Math.floor(minorDivisible);
  }

  saveEdits = () => {
    var pack = {
      ...this.state.pack,
      available: undefined
    }
    if (this.props.modularScreenType == 1) {
      this.props.addModular(pack);
    } else {
      this.props.editModular(pack);
    }
  }

  render() {
    return(
      <Box
        title="Montagem de Container Modular"
        closeBox={this.props.toggleModularScreen}>
        <Block columns={2}>
          <Input title="Montando:" type="text" readOnly={true} value={this.props.pack.description}/>
          <Input title="Quantidade:" type="number" min={1} max={this.calculateMax()} value={this.state.pack.quantity} onChange={this.changeQuantity}/>
        </Block>
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
          {text: "Remover", className: "button--danger", onClick: () => this.props.removeModular(this.state.pack)},
          {text: "Salvar", onClick: () => this.saveEdits()}
        ]}/>
      </Box>
    )
  }
}