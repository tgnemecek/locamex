import { Mongo } from 'meteor/mongo';

export const Pages = new Mongo.Collection('pages');

if (Meteor.isServer) {
  Meteor.publish('pagesPub', () => {
    return Pages.find();
  })
  Pages.remove({});
  Pages.insert({
    _id: "0000",
    description: "Database de Usuários",
    link: "/database/users",
    visible: true
  });
  Pages.insert({
    _id: "0001",
    description: "Lista de Tipos de Usuários",
    visible: true
  });
  Pages.insert({
    _id: "0002",
    description: "Lista de Serviços",
    visible: true
  });
  Pages.insert({
    _id: "0003",
    description: "Lista de Serviços",
    visible: true
  });
  Pages.insert({
    _id: "0004",
    description: "Lista de Serviços",
    visible: true
  });
  Pages.insert({
    _id: "0005",
    description: "Lista de Serviços",
    visible: true
  });
  Pages.insert({
    _id: "0006",
    description: "Lista de Serviços",
    visible: true
  });

  Pages.insert({
    _id: "0007",
    description: "Lista de Serviços",
    visible: true
  });
  Pages.insert({
    _id: "0008",
    description: "Lista de Serviços",
    visible: true
  });
}