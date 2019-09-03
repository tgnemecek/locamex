import React  from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';
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
  getFormattedDate = (which) => {
    var start = moment(this.props.charge.startDate).format("DD/MM/YYYY");
    var end = moment(this.props.charge.endDate).format("DD/MM/YYYY");
    var expiry = moment(this.props.charge.expiryDate).format("DD/MM/YYYY");

    if (which === "period") {
      return start + " a " + end;
    } else return expiry;
  }
  hasBeenPayed = () => {
    if (this.props.charge.status === "billed") {
      return (
        <FooterButtons buttons={[
          {text: "Pagamento Realizado", className: "button--pill", onClick: () => this.updateBilling("payed")},
        ]}/>
      )
    }
  }
  updateBilling = (status) => {
    var _id = this.props.contract._id;
    var index = this.props.charge.index;
    var type = this.props.charge.type
    var contract = this.props.contract;
    var billing = [...contract.snapshots[contract.activeVersion][type]]
    billing[index].status = status;
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      Meteor.call('contracts.billing.update', _id, billing, type, (err, res) => {
        if (err) this.setState({ databaseStatus: {status: "failed"} });
        if (res) {
          this.setState({ databaseStatus: {status: "completed"} });
        }
      })
    });
  }
  saveEdits = () => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      var pdf = new Pdf(
        {...this.props.contract, type: "billing"},
        this.props.databases,
        this.props.charge);

      pdf.generate().then(() => {
        this.updateBilling("billed");
      }).catch((err) => {
        console.log(err);
        this.setState({ databaseStatus: {status: "failed"} });
      })
    });
  }
  render() {
    return (
      <Box
        className="billing__bill-box"
        closeBox={this.props.closeBox}
        title="Emissão de Fatura">
        <div className="billing__bill-box__body">
          <div>
            <div>
              <label>Contrato: </label>
              {this.props.contract._id}.{this.props.contract.activeVersion}
            </div>
            <div>
              <label>Parcela: </label>
              {this.props.charge.index+1}/{this.props.charge.length}
            </div>
            <div>
              <label>Período: </label>
              {this.getFormattedDate("period")}
            </div>
            <div>
              <label>Vencimento: </label>
              {this.getFormattedDate("expiry")}
            </div>
            <div>
              <label>Valor da Parcela: </label>
              {tools.format(this.props.charge.value, 'currency')}
            </div>
          </div>
          <div>
            <div>
              <label>Descrição: </label>
              {this.props.charge.description}
            </div>
            <div>
              <label>Status: </label>
              {this.props.renderStatus(this.props.charge.status)}
            </div>
          </div>
        </div>
        {this.hasBeenPayed()}
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Gerar Fatura", className: "button--primary", onClick: this.saveEdits},
        ]}/>
        <DatabaseStatus
          callback={this.props.closeBox}
          status={this.state.databaseStatus.status}
          message={this.state.databaseStatus.message}/>
      </Box>
    )
  }
}