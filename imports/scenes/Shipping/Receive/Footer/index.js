import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationWindow: false,
      errorMsg: ""
    }
  }

  checkForProblems = () => {
    const isFormValid = () => {
      function hasPlace(array) {
        return array.every((item) => !!item.place);
      }
      if (!hasPlace(this.props.fixed)) return false;
      if (!hasPlace(this.props.modules)) return false;
      if (!hasPlace(this.props.accessories)) return false;
      return true;
    }
    if (isFormValid()) {
      this.setState({ errorMsg: "" }, () => {
        this.toggleConfirmationWindow();
      })
    } else this.setState({ errorMsg: "O formulário contém campos inválidos!" });
  }

  toggleConfirmationWindow = () => {
    this.setState({ confirmationWindow: !this.state.confirmationWindow });
  }

  render() {
    return (
      <div>
        <div className="error-message">{this.state.errorMsg}</div>
        <FooterButtons buttons={[{text: "Devolver Produtos", onClick: this.checkForProblems}]}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja devolver os produtos?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.receiveProducts}}/>
      </div>
    )
  }
}


