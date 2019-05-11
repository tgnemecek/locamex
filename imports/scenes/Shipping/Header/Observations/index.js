import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  render() {
      return (
        <Box
          title="Observações"
          closeBox={this.props.toggleWindow}
          width="400px">
            <div className={this.props.contract.status !== 'inactive' ? "contract--disabled" : null}>
              <div className="observations__body">
                <Input
                  title="Controle Interno:"
                  name="internal"
                  type="textarea"
                  disabled={true}
                  value={this.props.contract.observations.internal}
                  onChange={this.onChange}/>
                <Input
                  title="Expresso em Contrato:"
                  name="external"
                  type="textarea"
                  disabled={true}
                  value={this.props.contract.observations.external}
                  onChange={this.onChange}/>
              </div>
              {this.props.contract.status == 'inactive' ?
                <FooterButtons buttons={[{text: "Salvar Edições", onClick: this.saveEdits}]}/>
              : null}
            </div>
        </Box>
      )
  }
}