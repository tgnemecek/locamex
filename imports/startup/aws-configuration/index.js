import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

export var AWSAccessKeyId;
export var AWSSecretAccessKey;
export var AWSRegion = "sa-east-1";

if (Meteor.isProduction) {

  AWSAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  AWSSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

} else {
debugger;
  if (Meteor.settings.private) {
    AWSAccessKeyId = Meteor.settings.private.AWSAccessKeyId;
    AWSSecretAccessKey = Meteor.settings.private.AWSSecretAccessKey;
  } else {
    AWSAccessKeyId = '';
    AWSSecretAccessKey = '';
  }
}

AWS.config.AWSAccessKeyId = AWSAccessKeyId;
AWS.config.AWSSecretAccessKey = AWSSecretAccessKey;
AWS.config.region = AWSRegion;
AWS.config.update({
  region: AWSRegion,
  credentials: new AWS.Credentials(AWSAccessKeyId, AWSSecretAccessKey)
})