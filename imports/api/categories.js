import { Mongo } from 'meteor/mongo';

export const Categories = new Mongo.Collection('categories');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('categoriesPub', () => {
        return Categories.find();
      })
    }
    Categories.remove({});

    Categories.insert({
      name: "Administrativo",
      pages: [{
        name: "Usuários",
        link: "/listusers"
      }, {
        name: "Tipos de Usuários",
        link: "/listusertypes"
      }, {
        name: "Serviços",
        link: "/listservices"
      }]
    });
    Categories.insert({
      name: "Produtos",
      pages: []
    });
    Categories.insert({
      name: "Contratos",
      pages: []
    });
}