import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ContractShort from '../docs/contract-short';
import FileSaver from 'file-saver';

var pdf = require('html-pdf');

if (Meteor.isClient) {
  var Buffer = require('buffer/').Buffer;
  export default function generatePdf() {
    function meteorCall() {
      return new Promise((resolve, reject) => {
        Meteor.call('html-pdf', (err, res) => {
          if (err) reject(err);
          if (res) {
            var blob = new Blob([res], {type: 'application/pdf'});
            resolve(blob);
          }
        });
      });
    }
    async function asyncCall() {
      console.log('calling');
      var result = await meteorCall();
      FileSaver.saveAs(result, 'contrato.pdf');
    }
    asyncCall();
  }
}

if (Meteor.isServer) {
  var fs = Npm.require('fs');
  var tmp = require('tmp');

  Meteor.methods({
    async 'html-pdf'(state) {
      var options = { format: 'Letter' };
      var html = ReactDOMServer.renderToString(<ContractShort/>);
      // Alternate function readHtml can read any html file in 'D:/'
      // const readHtml = () => {
      //   return new Promise(resolve => {
      //     fs.readFile(process.env.HOMEPATH + '../../../Contrato.html', (err, data) => {
      //       if (err) console.log(err);
      //       resolve(data.toString());
      //     })
      //   })
      // }
      const createDirectory = () => {
        return new Promise(resolve => {
          tmp.dir({}, (err, path, cleanupCallback) => {
            if (err) throw err;
            resolve(path);
          })
        }).catch(e => console.log(e))
      }
      const createFile = (path) => {
        return new Promise(resolve => {
          var name = '/contract.pdf';
          pdf.create(html, options).toFile(path + name, (err, file) => {
            if (err) throw err;
            if (file) {
              var obj = {
                filename: file.filename,
                path: path,
                name: name
              };
              resolve(obj);
            }
          })
        }).catch(e => console.log(e));
      }
      const readFile = (obj) => {
        return new Promise(resolve => {
          fs.readFile(obj.filename, (err, data) => {
            if (err) throw err;
            if (data) resolve(data);
            cleanDirectory(obj.path, obj.name);
          })
        }).catch(e => console.log(e))
      }
      const cleanDirectory = (path, name) => {
        fs.unlink(path + name, (err) => {
          if (err) return console.log(err);
          fs.rmdir(path, err => console.log(err));
        });
      }
      return await readFile(await createFile(await createDirectory()));
    }
  })
}

