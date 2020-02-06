import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

import addresses from './addresses';
import accessories from './accessories';
import containers from './containers';
import series from './series';
import services from './services';
import clients from './clients';
import proposals from './proposals';
import contracts from './contracts';

export default function schema(database, selector, options) {
  if (!Meteor.isServer) throw new Meteor.Error('server-only');
  options || {};
  options = {
    clean: {
      trimStrings: true,
      removeEmptyStrings: false
    },
    ...options,
    check
  }

  clients = {
    partial: clients.partial,
    full: {
      ...clients.partial,
      address: new SimpleSchema(addresses),
    }
  };

  var schemas = {
    accessories,
    containers,
    series,
    services,
    clients,
    proposals: {
      full: {
        ...proposals.partial,
        accessories: Array,
        'accessories.$': {
          type: Object,
          blackbox: true
        },
        containers: Array,
        'containers.$': {
          type: Object,
          blackbox: true
        },
        services: Array,
        'services.$': {
          type: Object,
          blackbox: true
        },
      }
    },
    contracts: {
      full: {
        ...contracts.partial,
        deliveryAddress: new SimpleSchema(addresses),
        client: new SimpleSchema(clients.full),

        accessories: Array,
        'accessories.$': {
          type: Object,
          blackbox: true
        },
        containers: Array,
        'containers.$': {
          type: Object,
          blackbox: true
        },
        services: Array,
        'services.$': {
          type: Object,
          blackbox: true
        },
      }
    }
  }
  return new SimpleSchema({
    ...schemas[database][selector]
  }, options)
}