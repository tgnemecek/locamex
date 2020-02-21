import React from 'react';

export default class ModulesList extends React.Component {
  renderBody = () => {
    return this.props.modules.map((module, i) => {
      return (
        <tr key={i}>
          <td>{module.quantity}</td>
          <td className="table__wide">
            {module.description}
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="register-packs__module-list">
        <h4>Lista de Componentes</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Qtd.</th>
              <th className="table__wide">Componente</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
    )
  }
}

