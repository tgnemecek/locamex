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
    var preDatabase = this.props.moduleDatabase;
    var database = [];
    this.props.container.allowedModules.forEach((module, i) => {
      for (var j = 0; j < preDatabase.length; j++) {
        if (preDatabase[j]._id == module._id) {
          preDatabase[j].selected = module.selected;
          database.push(preDatabase[j]);
          break;
        }
      }
    })
    this.setState({ database });
  }

  changeQuantity = (name, quantity) => {
    this.setState({ quantity });
  }

  calculateMax = () => {
    var database = customTypes.deepCopy(this.state.database);
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
    this.state.database[e.target.name].selected = e.target.value;
    var quantity = 1;
    this.setState({ quantity });
    this.forceUpdate();
  }

  addModular = () => {
    var exportArray = [];
    var container = this.props.container;
    this.state.database.forEach((item) => {
      if (item.selected != 0 && item.selected != undefined) {
        exportArray.push(item);
      }
    })
    this.props.saveEdits(container, exportArray);
  }

  renderBody = () => {
    return this.state.database.map((module, i) => {
      function aaa() { return 1 };
      return (
        <tr key={i}>
          <td>{module._id}</td>
          <td>{module.description}</td>
          <td><CustomInput type="number" max={module.available} name={i} value={module.selected} onChange={this.onChange}/></td>
          <td>{module.available}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <Box
        title="Montagem de Container Modular:"
        closeBox={this.props.closeModularScreen}>
        <div>
          <label>Quantidade:</label>
          <CustomInput type="number" max={this.calculateMax()} value={this.state.quantity} onChange={this.changeQuantity}/>
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
          {text: "Cancelar", className: "button--secondary", onClick: () => this.props.closeModularScreen()},
          {text: "Salvar", onClick: () => this.props.addModular()}
        ]}/>
      </Box>
    )
  }
}