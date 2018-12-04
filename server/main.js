import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/startup/aws-configuration/index';
import '../imports/startup/app-structure/index';
import '../imports/startup/simple-schema-configuration/index';

import '../imports/api/accessories/index';
import '../imports/api/categories/index';
import '../imports/api/clients/index';
import '../imports/api/containers/index';
import '../imports/api/contracts/index';
import '../imports/api/history/index';
// import '../imports/api/images/index';
import '../imports/api/modules/index';
import '../imports/api/packs/index';
import '../imports/api/places/index';
import '../imports/api/services/index';
import '../imports/api/snapshots/index';
import '../imports/api/users/index';

Meteor.startup(() => {
  console.log(Meteor.settings); 
});