import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/api/categories';
import '../imports/api/pages';
import '../imports/api/services';
import '../imports/api/clients';
import '../imports/api/contracts';
import '../imports/api/users';
import '../imports/api/user-types';
import '../imports/startup/simple-schema-configuration';

Meteor.startup(() => {
});