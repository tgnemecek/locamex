import React from 'react';

import createPdf from '/imports/api/create-pdf/contract/index';
import { Clients } from '/imports/api/clients';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      document: '',
      representatives: ''
    }
  }

  componentDidMount() {
    this.contractsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var client = Clients.findOne(this.props.contract.clientId);
      this.setState({ client });
    })
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  generate = () => {
    var seller = {
      contact: 'Nome do Vendedor',
      phone: '(11) 94514-8263',
      email: 'tgnemecek@gmail.com'
    };
    var representatives = [{
      name: 'Alonso Pinheiro',
      cpf: 44097844533,
      rg: 358520319
    }, {
      name: 'Alonso Pinheiro',
      cpf: 44097844533,
      rg: 358520319
    }]
    createPdf(this.props.contract, this.state.client, seller, representatives);
  }

  render() {
      return (
        <Box
          title="Emitir Documentos:"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
              <div>
                <label>Documento:</label>
                <select>
                  <option value="proposal-long">Contrato</option>
                  <option value="invoice-sending">Nota Fiscal de Remessa</option>
                </select>
              </div>
              <div>
                <label>Representante Legal:</label>
                <select onChange={this.representativesOnChange}>
                  <option value={{_id: 0, contactId: 123}}>Nomeeee Sobrenome</option>
                </select>
              </div>
              <div>
                <label>Segundo Representante: (opcional)</label>
                <select onChange={this.representativesOnChange}>
                  <option value={{_id: 0, contactId: 123}}>Nomeeee Sobrenome</option>
                </select>
              </div>
            </div>
            <FooterButtons buttons={[
              {text: "Gerar", className: "button--primary", onClick: () => this.generate()},
            ]}/>
        </Box>
      )
  }
}