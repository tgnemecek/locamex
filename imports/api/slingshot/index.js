import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

import { AWSAccessKeyId, AWSSecretAccessKey, AWSRegion } from '/imports/startup/aws-configuration/index';

export default directives = {
  imageUploads: {
    bucket: "locamex-app",
    maxSize: 10 * 1024 * 1024,
    acl: "public-read",
    region: AWSRegion,
    AWSAccessKeyId,
    AWSSecretAccessKey,
    allowedFileTypes: ['image/png', 'image/jpeg'],
    authorize: function () {
      //Deny uploads if user is not logged in.
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },

    key: function (file, metaContext) {
      var cacheBypass = "_" + new Date().getTime();
      var parentFolder = Meteor.isDevelopment ? 'tests/' : '';
      var directory = `${parentFolder}user-uploads/${metaContext.type}/${metaContext.documentId}/${metaContext.formattedDate}${cacheBypass}/`;
      var name = metaContext.filename + "_" + metaContext.imageIndex + "." + metaContext.extension;

      return directory + name;
    }
  },
  flyerUploads: {
    bucket: "locamex-app",
    maxSize: 10 * 1024 * 1024,
    acl: "public-read",
    region: AWSRegion,
    AWSAccessKeyId,
    AWSSecretAccessKey,
    allowedFileTypes: ['application/pdf'],
    authorize: function () {
      //Deny uploads if user is not logged in.
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },

    key: function (file, metaContext) {
      var cacheBypass = "_" + new Date().getTime();
      var parentFolder = Meteor.isDevelopment ? 'tests/' : '';
      var directory = `${parentFolder}user-uploads/flyers/${metaContext.type}/${metaContext.formattedDate}${cacheBypass}/`;
      var name = metaContext.filename + "." + metaContext.extension;

      return directory + name;
    }
  }
}

if (Meteor.isServer) {
  Slingshot.createDirective(
    "imageUploads", Slingshot.S3Storage, directives.imageUploads);

  Slingshot.createDirective(
    "flyerUploads", Slingshot.S3Storage, directives.flyerUploads);
}