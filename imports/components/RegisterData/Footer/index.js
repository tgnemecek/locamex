import React from 'react';

import FooterButtons from '/imports/components/FooterButtons/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { confirmationWindow: false }
  }

  toggleConfirmationWindow = () => {
    var confirmationWindow = !this.state.confirmationWindow;
    this.setState({ confirmationWindow });
  }

  render() {
    return (
      <div>
        <FooterButtons buttons={this.props.item._id ? [
          {text: "Excluir Registro", className: "button--danger", onClick: this.toggleConfirmationWindow},
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Salvar", onClick: this.props.saveEdits}
        ] : [
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Salvar", onClick: this.props.saveEdits}
        ]}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja mesmo excluir este item do banco de dados?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.removeItem}}/>
      </div>
    )
  }
}