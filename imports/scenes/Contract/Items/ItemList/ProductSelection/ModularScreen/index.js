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
      pack: {},
      database: [],
      quantity: 1
    }
  }

  renderBody = () => {
    if (this.state.database.length == 0) return null;
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
          {/* <CustomInput type="number" min={1} max={this.calculateMax()} value={this.state.quantity} onChange={this.changeQuantity}/> */}
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
        {/* <FooterButtons buttons={[
          {text: "Remover", className: "button--danger", onClick: () => this.props.removeItem()},
          {text: "Salvar", onClick: () => this.saveEdits()}
        ]}/> */}
      </Box>
    )
  }
}