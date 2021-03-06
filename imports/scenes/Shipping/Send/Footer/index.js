import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ""
    }
  }

  checkForProblems = () => {
    const isFormValid = () => {
      var fixed = this.props.fixed;
      for (var i = 0; i < fixed.length; i++) {
        if (fixed[i].seriesId) {
          return true;
        }
      }
      var packs = this.props.packs;
      for (var i = 0; i < packs.length; i++) {
        if (packs[i].modules.reduce((acc, cur) => {
          return acc + cur.selected.length;
        }, 0)) {
          return true;
        }
      }
      var accessories = this.props.accessories;
      for (var i = 0; i < accessories.length; i++) {
        if (accessories[i].selected.reduce((acc, cur) => {
          return acc + cur.selected;
        }, 0)) {
          return true;
        }
      }
      return false;
    }
    if (isFormValid()) {
      this.setState({ errorMsg: "" }, () => {
        this.props.toggleConfirmationWindow();
      })
    } else {
      this.setState({
        errorMsg: "O formulário contém campos inválidos!"
      });
    }
  }

  render() {
    if (this.props.hidden) return null;
    return (
      <div>
        <div className="error-message">{this.state.errorMsg}</div>
        <FooterButtons
          buttons={[
            {text: "Enviar Produtos", onClick: this.checkForProblems}
          ]}/>
      </div>
    )
  }
}


