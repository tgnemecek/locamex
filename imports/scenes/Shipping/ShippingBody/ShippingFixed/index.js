import React from 'react';

export default class ShippingFixed extends React.Component {

  renderSubHeader = () => {
    if (this.props.index === 0) {
      return (
        <>
          <tr>
            <th>Containers Fixos:</th>
          </tr>
          <tr>
            <th>Modelo</th>
            <th>Série</th>
            <th>Pátio</th>
          </tr>
        </>
      )
    }
  }

  render() {
    return (
      <>
        {this.renderSubHeader()}
        <tr>
          <td>{this.props.model}</td>
          <td></td>
          <td></td>
          <td>BOTÃO</td>
        </tr>
      </>
    )
  }
}