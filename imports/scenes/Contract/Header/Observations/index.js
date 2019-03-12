import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annotations: this.props.contract.observations.annotations || '',
      productsObs: this.props.contract.observations.productsObs || '',
      servicesObs: this.props.contract.observations.servicesObs || ''
    }
  }

  onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    this.setState({ [key]: value });
  }

  saveEdits = () => {
    var observations = {
      generalObs: this.state.generalObs,
      productsObs: this.state.productsObs,
      servicesObs: this.state.servicesObs,
    }
    this.props.updateContract({ observations });
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
                <Input
                  title=""
                  name=""
                  type="textarea"
                  value={this.state.observations}
                  onChange={this.onChange}/>
                <Input
                  title=""
                  name=""
                  type="textarea"
                  value={this.state.observations}
                  onChange={this.onChange}/>
                <Input
                  title=""
                  name=""
                  type="textarea"
                  value={this.state.observations}
                  onChange={this.onChange}/>
                <Input
                  title=""
                  name=""
                  type="textarea"
                  value={this.state.observations}
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