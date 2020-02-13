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
    var errorMsg;
    const allEmpty = () => {
      var series = this.props.series;
      var seriesEmpty = series.every((item) => {
        return !item._id;
      })

      var accessories = this.props.accessories;
      var accessoriesEmpty = accessories.every((item) => {
        return !item.variations.length;
      })

      var packs = this.props.packs;
      var packsEmpty = packs.every((item) => {
        return !item.modules.length;
      })
      return seriesEmpty && accessoriesEmpty && packsEmpty;
    }
    if (!allEmpty()) {
      this.setState({ errorMsg: "" }, () => {
        this.props.toggleConfirmationWindow();
      })
    } else {
      this.setState({
        errorMsg: "O Envio deve incluir ao menos um produto."
      })
    }
  }

  render() {
    if (this.props.hidden) return null;
    return (
      <div>
        <div className="error-message">{this.state.errorMsg}</div>
        <FooterButtons
          buttons={[
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Enviar Produtos",
            onClick: this.checkForProblems}
          ]}/>
      </div>
    )
  }
}


