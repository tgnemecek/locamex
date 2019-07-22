import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/startup/aws-configuration/index';
import '../imports/startup/simple-schema-configuration/index';

import '../imports/api/accessories/index';
import '../imports/api/aws/index';
import '../imports/api/batch/index';
import '../imports/api/clients/index';
import '../imports/api/containers/index';
import '../imports/api/contracts/index';
import '../imports/api/history/index';
import '../imports/api/slingshot/index';
import '../imports/api/modules/index';
import '../imports/api/packs/index';
import '../imports/api/pdf/index';
import '../imports/api/places/index';
import '../imports/api/proposals/index';
import '../imports/api/series/index';
import '../imports/api/services/index';
import '../imports/api/snapshots/index';
import '../imports/api/test/index';
import '../imports/api/users/index';

Meteor.startup(() => {
});