import {Mongo} from 'meteor/mongo';

export const UserTypes = new Mongo.Collection('userTypes');

// UserTypes.remove({});

UserTypes.insert({type: "adm"});
UserTypes.insert({type: "guest"});