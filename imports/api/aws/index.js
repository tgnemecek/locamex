import AWS from 'aws-sdk';

if (Meteor.isServer) {

  Meteor.methods({
    'aws.write'(dataUri, filePath) {
      var buff = new Buffer(dataUri.split(',')[1], 'base64');
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      if (Meteor.isDevelopment) {
        filePath = "tests/" + filePath;
      }
      var params = {
        ACL: 'public-read-write',
        Bucket : 'locamex-app',
        Body: buff,
        Key: filePath
      }
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      })
    }
  })
}