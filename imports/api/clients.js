import { Mongo } from 'meteor/mongo';

export const Clients = new Mongo.Collection('clients');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('clientsPub', () => {
        return Clients.find();
      })
    }

    Clients.remove({});

    Clients.insert({
      _id: "0000",
      name: "Exemplo",
      type: "Pessoa Jurídica",
      nameOfficial: "Exemplo Empreendimentos",
      registryES: "192837273",
      registryMU: "364645445",
      contacts: [{
        name: "João Carlos",
        telephone: "9554-3122",
        email: "joao.carlos@exemplo.com",
        cpf: "532.353.653-12"
      }, {
        name: "Cristina Clara",
        telephone: "5467-5333",
        email: "cristina.clara@exemplo.com",
        cpf: "887.774.1638-76"
      }]
    });
  }