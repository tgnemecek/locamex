import React from 'react';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Fixed from './Fixed/index';
import Modular from './Modular/index';

export default class RegisterContainers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.item ? this.props.item.type : 'pick'
    }
  }

  onClick = (e) => {
    this.setState({ type: e.target.value });
  }

  render() {
    if (this.state.type === 'fixed') {
      return <Fixed {...this.props} />
    } else if (this.state.type === 'modular') {
      return <Modular {...this.props} />
    } else return (
      <Box
        className="register-data register-containers--choose-type"
        title="Selecione o Tipo de Container"
        closeBox={this.props.toggleWindow}>
        <div className="register-containers--choose-type__buttons">
          <button
            className="button--pill"
            value="fixed"
            onClick={this.onClick}>
            CONTAINER FIXO
          </button>
          <button
            className="button--pill"
            value="modular"
            onClick={this.onClick}>
            CONTAINER MODULAR
          </button>
        </div>
        <FooterButtons buttons={[{text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow}]}/>
      </Box>
    )
  }
}