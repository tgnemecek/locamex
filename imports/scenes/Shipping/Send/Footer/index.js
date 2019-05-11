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
      var fixed = this.props.fixed;
      for (var i = 0; i < fixed.length; i++) {
        if (!fixed[i].seriesId) {
          return false;
        }
      }
      var modules = this.props.modules;
      for (var i = 0; i < modules.length; i++) {
        if (!modules[i].selected.reduce((acc, cur) => {
          return acc + cur.selected;
        }, 0)) {
          return false;
        }
      }
      var accessories = this.props.accessories;
      for (var i = 0; i < accessories.length; i++) {
        if (accessories[i].selected.reduce((acc, cur) => {
          return acc + cur.selected;
        }, 0) !== accessories[i].renting) {
          return false;
        }
      }
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
        <FooterButtons buttons={[{text: "Enviar Produtos", onClick: this.checkForProblems}]}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja enviar os produtos?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.sendProducts}}/>
      </div>
    )
  }
}

