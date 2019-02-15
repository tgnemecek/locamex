import React from 'react';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
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
        title="Selecione o Tipo de Container"
        closeBox={this.props.toggleWindow}
        width="800px">
        <Block columns={2}>
          <div>
            <button style={{width: "100%"}} className="button" value="fixed" onClick={this.onClick}>Fixo</button>
          </div>
          <div>
            <button style={{width: "100%"}} className="button" value="modular" onClick={this.onClick}>Modular</button>
          </div>
        </Block>
        <FooterButtons buttons={[{text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow}]}/>
      </Box>
    )
  }
}