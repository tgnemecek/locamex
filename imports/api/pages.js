import { Mongo } from 'meteor/mongo';

export const Pages = new Mongo.Collection('pages');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('pagesPub', () => {
        return Pages.find();
      })
    }
    Pages.remove({});

    Pages.insert({
      name: "ListUsers",
      label: "Lista de Usuários"
    });
    Pages.insert({
      name: "ListUserTypes",
      label: "Lista de Tipos de Usuários"
    });
    Pages.insert({
      name: "ListServices",
      label: "Lista de Serviços"
    });
}