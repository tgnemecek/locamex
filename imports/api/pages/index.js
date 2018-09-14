import { Mongo } from 'meteor/mongo';

export const Pages = new Mongo.Collection('pages');

if (Meteor.isServer) {
  Meteor.publish('pagesPub', () => {
    return Pages.find();
  })
  Pages.remove({});
  Pages.insert({
    _id: "0000",
    description: "Início",
    link: "/dashboard",
    visible: true
  });
  Pages.insert({
    _id: "0001",
    description: "Usuários",
    link: "/database/users",
    visible: true
  });
  Pages.insert({
    _id: "0002",
    description: "Clientes",
    link: "/database/clients",
    visible: true
  });
  Pages.insert({
    _id: "0003",
    description: "Containers",
    link: "/database/containers",
    visible: true
  });
  Pages.insert({
    _id: "0004",
    description: "Acessórios",
    link: "/database/accessories",
    visible: true
  });
  Pages.insert({
    _id: "0005",
    description: "Componentes",
    link: "/database/modules",
    visible: true
  });
  Pages.insert({
    _id: "0006",
    description: "Serviços",
    link: "/database/services",
    visible: true
  });
  Pages.insert({
    _id: "0007",
    description: "Contratos",
    link: "/database/contracts",
    visible: true
  });
  Pages.insert({
    _id: "0008",
    description: "Pacotes",
    link: "/database/packs",
    visible: true
  });
}