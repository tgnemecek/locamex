import React from 'react';

import pdfmake from '/imports/api/pdfmake';
import { Clients } from '/imports/api/clients';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsDatabase: [],
      document: '',
      representatives: ''
    }
  }

  componentDidMount() {
    this.contractsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var clientsDatabase = Clients.find().fetch();
      this.setState({ clientsDatabase });
    })
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  generate = (e) => {
    var clients = this.state.clientsDatabase;
    var print = {
      contractInfo: {
        _id: this.props.contract._id,
        startDate: this.props.contract.startDate,
        duration: this.props.contract.duration,
        deliveryAddress: {
          number: 1212,
          street: 'Rua Sonia Ribeiro',
          zip: '04621010',
          district: 'Campo Belo',
          city: 'São Paulo',
          state: 'SP',
        },
        products: [{
          _id: '0000',
          name: 'Container LOCA 610 RSTC',
          price: 1500,
          quantity: 2,
          restitution: 30000
        }, {
          _id: '0055',
          name: 'Container LOCA 300',
          price: 500,
          quantity: 3,
          restitution: 20000
        }],
        services: [{
          _id: '0010',
          name: 'Movimentação',
          price: 3000,
          quantity: 2
        }, {
          _id: '0016',
          name: 'Acoplamento',
          price: 1000,
          quantity: 2
        }, {
          _id: '0099',
          name: 'Munck',
          price: 900,
          quantity: 1
        }]
      },
      clientInfo: {},
      billingInfo: this.props.contract.billing,
    }
    for (var i = 0; i < clients.length; i++) {
      if (clients[i]._id == this.props.contract.clientId) {
        print.clientInfo = clients[i];
      }
    }
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
    pdfmake(print, seller, representatives);
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