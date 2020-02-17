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

      var variations = this.props.variations;
      var variationsEmpty = variations.every((item) => {
        return !item.places.length;
      })

      var packs = this.props.packs;
      var packsEmpty = packs.every((item) => {
        return !item.modules.length;
      })
      return seriesEmpty && variationsEmpty && packsEmpty;
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

  hidden = () => {
    const filterAccessories = () => {
      return this.props.snapshot.accessories
      .filter((accessory) => {
        accessory.max = accessory.quantity;
        var found = this.props.currentlyRented.variations
          .filter((variation) => {
            return variation.accessory._id === accessory._id;
          })
        if (!found.length) return true;
        var inClient = found.reduce((acc, item) => {
          return item.quantity;
        }, 0)
        accessory.max -= inClient;
        return accessory.max > 0;
      })
    }
    return (
      !filterAccessories().length &&
      !this.props.series.length &&
      !this.props.packs.length
    )
  }

  render() {
    if (this.hidden()) {
      return "Não há itens disponíveis para envio!";
    }
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


