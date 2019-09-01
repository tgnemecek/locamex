import React  from 'react';
import moment from 'moment';
import Icon from '/imports/components/Icon/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Pdf from '/imports/helpers/Pdf/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class BillBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: {}
    }
  }
  saveEdits = () => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      var pdf = new Pdf(
        {...this.props.contract, type: "billing"},
        this.props.databases,
        this.props.charge);

      pdf.generate().then(() => {
        this.setState({ databaseStatus: {status: "completed"} });
      }).catch((err) => {
        console.log(err);
        this.setState({ databaseStatus: {status: "failed"} });
      })
    });
  }
  render() {
    return (
      <Box
        title="Emissão de Fatura">
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Salvar e Gerar Fatura", className: "button--primary", onClick: this.saveEdits},
        ]}/>
        <DatabaseStatus
          status={this.state.databaseStatus.status}
          message={this.state.databaseStatus.message}/>
      </Box>
    )
  }
}