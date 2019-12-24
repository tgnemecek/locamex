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
        this.props.toggleConfirmationWindow();
      })
    } else this.setState({ errorMsg: "O formulário contém campos inválidos!" });
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


