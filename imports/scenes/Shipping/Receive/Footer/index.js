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
      function hasAtLeastOneFilled(array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].place) return true;
        }
        return false;
      }
      return (
        hasAtLeastOneFilled(this.props.fixed) ||
        hasAtLeastOneFilled(this.props.modules) ||
        hasAtLeastOneFilled(this.props.accessories)
      )
    }
    if (isFormValid()) {
      this.setState({ errorMsg: "" }, () => {
        this.props.toggleConfirmationWindow();
      })
    } else this.setState({ errorMsg: "Escolha ao menos um item." });
  }

  render() {
    return (
      <div>
        <div className="error-message">{this.state.errorMsg}</div>
        <FooterButtons buttons={[{text: "Devolver Produtos", onClick: this.checkForProblems}]}/>
      </div>
    )
  }
}


