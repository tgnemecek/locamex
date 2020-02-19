import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Settings = new Mongo.Collection('settings');

Settings.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// Settings.insert({
//   proposal: {
//     defaultConditionsMonths: '• Valores referentes à locação deverão ser pagos mensalmente, com primeiro pagamento em 15 dias da entrega.\n• Valores referentes ao Pacote de Serviços deverão ser pagos com sinal no ato e 50% de saldo em 30 dias.',
//     defaultConditionsDays: '• O Valor Total do Orçamento deverá ser pago com sinal de 50% no fechamento da proposta e 50% de saldo em até 3 dias antes da entrega.'
//   }
// })

if (Meteor.isServer) {
  Meteor.publish('settingsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Settings.find({});
  })

  Meteor.methods({
    'settings.update'(settings) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var _id = settings._id;
      delete settings._id;
      Settings.update({_id}, settings);
      
      return true;
    }
  })
}