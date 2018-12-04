import { Meteor } from 'meteor/meteor';

Slingshot.createDirective("imageUploads", Slingshot.S3Storage, {
  bucket: "locamex-app",
  maxSize: 10 * 1024 * 1024,
  acl: "public-read",
  region: Meteor.settings.region,
  AWSAccessKeyId: Meteor.settings.AWSAccessKeyId,
  AWSSecretAccessKey: Meteor.settings.AWSSecretAccessKey,
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file, metaContext) {
    var url = "user-uploads/" + metaContext.itemType + metaContext.itemId + "/" + metaContext.formattedDate + "/" + metaContext.imageIndex + "." + metaContext.extension;
    return url;
  }
});