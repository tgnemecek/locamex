import { Meteor } from 'meteor/meteor';
var AWS = require('aws-sdk');

var AWSAccessKeyId = Meteor.settings.AWSAccessKeyId;
var AWSSecretAccessKey = Meteor.settings.AWSSecretAccessKey;
var region = Meteor.settings.region;

AWS.config.AWSAccessKeyId = AWSAccessKeyId;
AWS.config.AWSSecretAccessKey = AWSSecretAccessKey;
AWS.config.region = region;