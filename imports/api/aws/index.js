import AWS from 'aws-sdk';

if (Meteor.isServer) {

  var Bucket = 'locamex-app';

  Meteor.methods({
    'aws.write'(dataUrl, filePath) {
      var buff = new Buffer(dataUrl.split(',')[1], 'base64');
      var s3 = new AWS.S3({apiVersion: '2006-03-01'});
      if (Meteor.isDevelopment) {
        filePath = "tests/" + filePath;
      }
      var params = {
        ACL: 'public-read-write',
        Bucket,
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
    },
    'aws.write.multiple'(filesWithUrl) {
      return new Promise((resolve, reject) => {
        var promises = filesWithUrl.map((file, i) => {
          return new Promise((resolve, reject) => {
            Meteor.call('aws.write', file.dataUrl, file.filePath, (err, res) => {
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
      return new Promise((resolve, reject) => {
        var s3 = new AWS.S3();
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
    'aws.delete.directory' (folder) {
      return new Promise((resolve, reject) => {
        var s3 = new AWS.S3();

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