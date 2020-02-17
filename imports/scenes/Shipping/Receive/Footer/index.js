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
        return !item.place._id;
      })

      var variations = this.props.variations;
      var variationsEmpty = variations.every((item) => {
        return !item.place._id || !item.quantity
      })

      var packs = this.props.packs;
      var packsEmpty = packs.every((item) => {
        return !item.place._id;
      })
      return seriesEmpty && variationsEmpty && packsEmpty;
    }
    if (!allEmpty()) {
      this.setState({ errorMsg: "" }, () => {
        this.props.toggleConfirmationWindow();
      })
    } else {
      this.setState({
        errorMsg: "A Devolução deve incluir ao menos um produto."
      })
    }
  }

  render() {
    if (!this.props.series.length &&
      !this.props.variations.length &&
      !this.props.packs.length) {
      return (
        "Não há itens disponíveis para devolução!"
      )
    }
    return (
      <div>
        <div className="error-message">{this.state.errorMsg}</div>
        <FooterButtons
          buttons={[
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Devolver Produtos",
            onClick: this.checkForProblems}
          ]}/>
      </div>
    )
  }
}


