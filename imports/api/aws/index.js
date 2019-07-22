import AWS from 'aws-sdk';
const fs = require('fs');

if (Meteor.isServer) {

  Meteor.methods({
    'aws'(file) {
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      var bucketParams = {
        Bucket : 'locamex-app',
      };
      var params = {
        Bucket : 'locamex-app',
        Key: 'key',
        Body: file
      }
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            console.log("-----------");
            console.log(file);
            reject(err);
          } else {
            resolve(data);
          }
        });
      })
      // return new Promise((resolve, reject) => {
      //   s3.listObjects(bucketParams, (err, data) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(data);
      //     }
      //   });
      // })
    }
  })
}