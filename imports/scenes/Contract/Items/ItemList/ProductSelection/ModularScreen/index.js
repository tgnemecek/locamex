import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import CustomInput from '/imports/components/CustomInput/index';

export default class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pack: this.props.pack
    }
  }

  componentDidMount() {
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
        var selected;
        var available;
        var description;
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == module) {
            available = moduleDatabase[i].available;
            if (!selected) selected = available > 0 ? 1 : 0;
            description = moduleDatabase[i].description;
          }
        }
        return {_id: module, available, selected, description}
      });
    } else if (this.props.modularScreenType == 2) { //Edit
      pack = {...this.props.pack};
      pack.modules = this.props.pack.modules.map((module, i) => {
        var selected;
        var available;
        var description;
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == module._id) {
            selected = module.selected;
            available = Number(moduleDatabase[i].available) + (module.selected * pack.quantity);
            description = moduleDatabase[i].description;
            return {_id: module._id, available, selected, description};
          }
        }
      });
    }
    this.setState({ pack });
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
    pack.modules[index].selected = value;
    this.setState({ pack });
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

  render() {
    return(
      <Box
        title="Montagem de Container Modular"
        closeBox={this.props.toggleModularScreen}>
        <div>
          <h4>Montando: {this.props.pack.description}</h4>
          <label>Quantidade:</label>
          <CustomInput type="number" min={1} max={this.calculateMax()} value={this.state.pack.quantity} onChange={this.changeQuantity}/>
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
          {text: "Remover", className: "button--danger", onClick: () => this.props.removeModular(this.state.pack)},
          {text: "Salvar", onClick: () => this.saveEdits()}
        ]}/>
      </Box>
    )
  }
}