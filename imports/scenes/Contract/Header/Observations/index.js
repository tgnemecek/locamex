import React from 'react';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: this.props.contract.observations
    }
  }

  onChange = (e) => {
    var observations = e.target.value;
    this.setState({ observations });
  }

  saveEdits = () => {
    this.props.contract.observations = this.state.observations;
    this.props.toggleWindow();
  }

  render() {
      return (
        <Box
          title="Observações"
          closeBox={this.props.toggleWindow}
          width="400px">
            <div className={this.props.contract.status !== 'inactive' ? "contract--disabled" : null}>
              <div className="observations__body">
                <textarea value={this.state.observations} onChange={this.onChange}/>
              </div>
              {this.props.contract.status == 'inactive' ?
                <FooterButtons buttons={[{text: "Salvar Edições", onClick: this.saveEdits}]}/>
              : null}
            </div>
        </Box>
      )
  }
}