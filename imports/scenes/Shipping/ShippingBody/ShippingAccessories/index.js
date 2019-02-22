import React from 'react';

export default class ShippingAccessories extends React.Component {

  renderSubHeader = () => {
    if (this.props.index === 0) {
      return (
        <>
          <tr>
            <th>Acessórios:</th>
          </tr>
          <tr>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th></th>
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
          <td>{this.props.description}</td>
          <td></td>
          <td></td>
          <td>BOTÃO</td>
        </tr>
      </>
    )
  }
}