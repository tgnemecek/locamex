import AWS from 'aws-sdk';
import tools from '/imports/startup/tools/index';

if (Meteor.isServer) {

  var Bucket = 'locamex-app';
  var s3 = new AWS.S3();
  var prefix = "https://locamex-app.s3.sa-east-1.amazonaws.com/";

  Meteor.methods({
    'aws.read'(Key, callback) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var params = {
        Bucket,
        Key: Key.replace(prefix, "")
      }
      return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
          if (err) {
            console.log(err);
            // throw new Meteor.Error(err);
          } else {
            resolve(data);
          }
        })
      })
    },
    'aws.write'(dataUrl, Key) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var buff = Buffer.from(dataUrl.split(',')[1], 'base64');
      Key = Key.replace(prefix, "");
      if (Meteor.isDevelopment) {
        Key = "tests/" + Key;
      }
      var params = {
        ACL: 'public-read-write',
        Bucket,
        Body: buff,
        Key
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
    },
    'aws.write.multiple'(filesWithUrl) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      return new Promise((resolve, reject) => {
        var promises = filesWithUrl.map((file, i) => {
          return new Promise((resolve, reject) => {
            Meteor.call('aws.write', file.dataUrl, file.Key, (err, res) => {
              if (err) reject(err);
              if (res) {
                resolve(res.Location);
              }
            });
          })
        })
        Promise.all(promises).then((urls) => {
          resolve(urls);
        })
        .catch((err) => {
          reject(err);
        })
      })
    },
    'aws.copy.object' (oldKey, newKey, deleteOrigin) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      return new Promise((resolve, reject) => {
        // if (Meteor.isDevelopment) {
        //   oldKey = "tests/" + oldKey;
        //   newKey = "tests/" + newKey;
        // }

        var params = {
          ACL: 'public-read-write',
          Bucket,
          CopySource: "/" + Bucket + "/" + oldKey,
          Key: newKey
        }

        s3.copyObject(params, (err, data) => {
          if (err) reject({
            ...err,
            oldKey
          });
          if (data) {
            if (deleteOrigin) {
              var params = {
                Bucket,
                Key: oldKey
              }
              s3.deleteObject(params, (err, data) => {
                if (err) reject(err);
                if (data) resolve(data);
              })
            } else resolve(data);
          }
        })
      })
    },
    // 'aws.delete.objects'(Keys) { // NOT YET USED, CHECK IF ITS WORKING
    //  if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    // return new Promise((resolve, reject) => {
    //     return resolve(Keys);
    //     if (!Array.isArray(Keys)) reject('not-array');
    //     if (!Keys.length) return resolve(Keys);
    //
    //     var Objects = Keys.map((Key) => {
    //       return {
    //         Key
    //       }
    //     })
    //
    //
    //     var params = {
    //       Bucket,
    //       Delete: {
    //         Objects
    //       }
    //     }
    //     s3.deleteObjects(params, (err, data) => {
    //       if (err) reject(err);
    //       if (data) {
    //         resolve(data);
    //       }
    //     })
    //   })
    // },
    'aws.delete.directory' (folder) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      return new Promise((resolve, reject) => {
        if (tools.isUrl(folder)) {
          folder = folder.replace(prefix, "");
        }

        if (Meteor.isDevelopment) {
          folder = "tests/" + folder;
        }

        var params = {
          Bucket,
          Prefix: folder,
          MaxKeys: 20
        }
        s3.listObjects(params, (err, data) => {
          if (err) if (err) reject(err);
          if (data) {
            if (data.Contents.length) {
              var Objects = data.Contents.map((item) => {
                return { Key: item.Key }
              })
              var params = {
                Bucket,
                Delete: { Objects }
              }
              s3.deleteObjects(params, (err, data) => {
                if (err) if (err) reject(err);
                if (data) {
                  resolve(data);
                }
              })
            } else resolve(data);
          }
        })
      })
    }
  })
}