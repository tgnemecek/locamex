import React from 'react';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class PackInspector extends React.Component {
  renderBody = () => {
    return this.props.pack.modules.map((module, i) => {

      if (this.props.pack.place) {
        return (
          <tr key={i}>
            <td>{module.quantity}</td>
            <td className="table__wide">
              {module.description}
            </td>
            <td style={{textAlign: "left"}}>
              {this.props.pack.place.description}
            </td>
          </tr>
        )
      }
      return module.places.map((place) => {
        return (
          <tr key={i}>
            <td>{place.quantity}</td>
            <td className="table__wide">
              {module.description}
            </td>
            <td style={{textAlign: "left"}}>
              {place.description}
            </td>
          </tr>
        )
      })
    })
  }
  renderTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Qtd.</th>
            <th className="table__wide">Componente</th>
            <th style={{textAlign: "left"}}>Pátio</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <Box
        title="Lista de Componentes"
        subtitle={`${this.props.pack.container.description}: ${this.props.pack.description}`}
        style={{width: "50%"}}
        closeBox={this.props.toggleWindow}>
        {this.renderTable()}
        <FooterButtons buttons={[
          {
            onClick: this.props.toggleWindow,
            text: "Voltar",
            className: "button--secondary"
          }
        ]}/>
      </Box>
    )
  }
}

