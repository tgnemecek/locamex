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
      companyName: "Exemplo",
      type: "company",
      cnpj: "3123131233",
      officialName: "Exemplo Empreendimentos",
      registryES: "192837273",
      registryMU: "364645445",
      observations: 'Cliente do Rio de Janeiro',
      contacts: [{
        "_id" : 0,
        name: "João Carlos",
        telephone_1: "9554-3122",
        telephone_2: "1234-1234",
        email: "joao.carlos@exemplo.com",
        cpf: "532.353.653-12"
      }, {
        "_id" : 1,
        name: "Cristina Clara",
        telephone_1: "5467-5333",
        telephone_2: "",
        email: "cristina.clara@exemplo.com",
        cpf: "887.774.1638-76"
      }]
    });
  }