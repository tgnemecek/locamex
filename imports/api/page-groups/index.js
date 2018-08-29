import { Mongo } from 'meteor/mongo';

export const PageGroup = new Mongo.Collection('pageGroup');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('pageGroupPub', () => {
        return PageGroup.find();
      })
    }
    PageGroup.remove({});
    PageGroup.insert({
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
    PageGroup.insert({
      name: "Contratos",
      pages: []
    });
    PageGroup.insert({
      name: "Clientes",
      pages: []
    });
    PageGroup.insert({
      name: "Produtos",
      pages: []
    });
    PageGroup.insert({
      name: "Financeiro",
      pages: []
    });
    PageGroup.insert({
      name: "Manutenção",
      pages: []
    });
}