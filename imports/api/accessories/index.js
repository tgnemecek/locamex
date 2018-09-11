import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');

if (Meteor.isServer) {
  Meteor.publish('accessoriesPub', () => {
    return Accessories.find();
  })
  // Accessories.remove({});
  // Accessories.insert({
  //   _id: "0000",
  //   description: "Cadeira Tipo A",
  //   category: "0000",
  //   place: "0001",
  //   available: 100,
  //   rented: 50,
  //   maintenance: 10,
  //   price: 100,
  //   restitution: 600,
  //   observations: '',
  //   visible: true
  // })
  // Accessories.insert({
  //   _id: "0001",
  //   description: "Cadeira Tipo B",
  //   category: "0000",
  //   place: "0001",
  //   available: 100,
  //   rented: 50,
  //   maintenance: 10,
  //   price: 100,
  //   restitution: 600,
  //   observations: '',
  //   visible: true
  // })

  Meteor.methods({
    'accessories.insert'(state) {
      const _id = tools.generateId(Accessories);
      const data = {
        _id,
        description: state.description,
        category: state.category,
        place: state.place,
        available: state.available,
        rented: state.rented,
        maintenance: state.maintenance,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        visible: true
      }
      Accessories.insert(data);
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.hide'(_id) {
      const data = {
        visible: false
      }
      Accessories.update({ _id: _id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.rent' (accessories) {
      var data = [];
      for (var i = 0; i < accessories.length; i++) {
        var changes = {
          available: -accessories[i].quantity,
          rented: accessories[i].quantity
        }
        Accessories.update({ _id: accessories[i]._id }, { $inc: changes });
        if (!data.includes(accessories[i])) data.push(accessories[i]);
        Meteor.call('history.insert', data, 'accessories.rent');
      }
    },
    'accessories.receive' (accessories) {
      var data = [];
      for (var i = 0; i < accessories.length; i++) {
        if (accessories[i].quantity == 0) continue;
        var changes = {
          available: accessories[i].quantity,
          rented: -accessories[i].quantity
        }
        Accessories.update({ _id: accessories[i]._id }, { $inc: changes });
        if (!data.includes(accessories[i])) data.push(accessories[i]);
        Meteor.call('history.insert', data, 'accessories.receive');
      }
    },
    'accessories.check'(_id, quantity) {
      const item = Accessories.findOne(_id);
      if (!item) throw new Meteor.Error("_id-not-found", "Erro de banco de dados", arguments);
      if (item.available < quantity) {
        return false;
      } else return true;
    },
    'accessories.update'(state) {
      const data = {
        description: state.description,
        category: state.category,
        place: state.place,
        available: state.available,
        rented: state.rented,
        maintenance: state.maintenance,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        visible: true
      }
      Accessories.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    }
  })
}