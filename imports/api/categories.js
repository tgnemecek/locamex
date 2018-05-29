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
        name: "Permissões de Usuários",
        link: "/listusertypes"
      }, {
        name: "Serviços",
        link: "/listservices"
      }]
    });
    Categories.insert({
      name: "Contratos",
      pages: []
    });
    Categories.insert({
      name: "Clientes",
      pages: []
    });
    Categories.insert({
      name: "Produtos",
      pages: []
    });
    Categories.insert({
      name: "Financeiro",
      pages: []
    });
    Categories.insert({
      name: "Manutenção",
      pages: []
    });
}