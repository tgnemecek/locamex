import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class ModularScreen extends React.Component {
  constructor(props) {
    super(props);
    const setModules = () => {
      var moduleDatabase = this.props.moduleDatabase;
      return this.props.item.allowedModules.map((_id, i) => {
        var available = 0;
        var description = "";
        for (var i = 0; i < moduleDatabase.length; i++) {
          if (moduleDatabase[i]._id == _id) {
            available = tools.countAvailableItems(moduleDatabase[i].place);
            description = moduleDatabase[i].description;
          }
        }
        return {
          _id,
          description,
          available,
          selected: 0
        };
      });
    }

    if (this.props.isPackNew) { // Setting state for a new Pack
      this.state = {
        pack: {
          _id: undefined,
          containerId: this.props.isPackNew ? this.props.item._id : this.props.item.containerId,
          description: this.props.item.description,
          type: "pack",
          status: "rented",
          price: this.props.item.price,
          restitution: this.props.item.restitution,
          visible: true,
          place: '',
          modules: setModules(),
          quantity: 1
        },
        errorMsg: null,
        errorKeys: []
      }
    } else { // Setting state from a previous Pack (editing)
      this.state = { pack: {...this.props.item} }
    }
  }

  renderBody = () => {
    return this.state.pack.modules.map((module, i) => {
      const changeModuleQuantity = (e) => {
        var pack = { ...this.state.pack };

        var selected = Number(e.target.value);
        var max = this.calculateMax();
        var quantity = this.state.pack.quantity;
        if (quantity > max) quantity = max;

        pack.modules[i].selected = selected;
        pack.quantity = quantity;
        this.setState({ pack });
      }
      return (
        <tr key={i}>
          <td>{module.description}</td>
          <td><Input
                type="number"
                max={module.available}
                name={i}
                value={module.selected}
                onChange={changeModuleQuantity}/></td>
          <td>{module.available}</td>
        </tr>
      )
    })
  }

  changePackQuantity = (e) => {
    var quantity = e.target.value;
    var pack = {...this.state.pack, quantity }
    this.setState({ pack });
  }

  calculateMax = () => {
    var modules = this.state.pack.modules;
    if (!modules) return 0;
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
    if (this.state.pack.quantity === 0) {
      this.setState({ errorMsg: "Quantidade não permitida.", errorKeys: ["quantity"] });
      return;
    }
    if (this.props.isPackNew) {
      this.props.addModular(this.state.pack);
    } else {
      this.props.editModular(this.state.pack);
    }
  }

  toggleModularScreen = () => {
    this.props.toggleModularScreen();
  }

  render() {
    return(
      <Box
        title="Montagem de Container Modular"
        width="550px"
        closeBox={this.toggleModularScreen}>
        <div className="error-message">{this.state.errorMsg}</div>
        <Block columns={2}>
          <Input title="Montando:" type="text" readOnly={true} value={this.state.pack.description}/>
          <Input
            title="Quantidade:"
            type="number"
            name="quantity"
            style={this.state.errorKeys.includes("quantity") ? {borderColor: "red"} : null}
            min={0}
            max={this.calculateMax()}
            value={this.state.pack.quantity}
            onChange={this.changePackQuantity}/>
        </Block>
        <div className="modular-screen__body">
          <table className="table table--modular-screen">
            <thead>
              <tr>
                <th>Componentes</th>
                <th>Qtd.</th>
                <th>Disp.</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        {this.props.isPackNew ?
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.toggleModularScreen()},
            {text: "Adicionar", onClick: () => this.saveEdits()}
          ]}/>
          :
          <FooterButtons buttons={[
            {text: "Remover", className: "button--danger", onClick: () => this.props.removeModular(this.state.pack)},
            {text: "Salvar", onClick: () => this.saveEdits()}
          ]}/>
        }
      </Box>
    )
  }
}