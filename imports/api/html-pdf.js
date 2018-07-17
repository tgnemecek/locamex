import { Meteor } from 'meteor/meteor';
import ReactDOMServer from 'react-dom/server';
import contractShort from '../docs/contract-short';
import FileSaver from 'file-saver';

var pdf = require('html-pdf');

if (Meteor.isClient) {
  var toBlob = require('stream-to-blob');

  export default function generatePdf() {
    function meteorCall() {
      return new Promise((resolve, reject) => {
        Meteor.call('html-pdf', (err, res) => {
          if (err) reject(err);
          if (res) {
            toBlob(res, (e, blob) => {
              console.log('aaa');
              resolve(blob);
            })
          }
        });
      });
    }
    async function asyncCall() {
      console.log('calling');
      var result = await meteorCall();
      var file = new File(["aaa"], result.filename, {
  type: "text/plain",
});
      // FileSaver.saveAs(file);
      console.log('file: ', result);
    }
    asyncCall();
  }
}

if (Meteor.isServer) {
  var fs = Npm.require('fs');

  Meteor.methods({
    async 'html-pdf'() {
      var options = { format: 'Letter' };
      var html = ReactDOMServer.renderToString(contractShort());
      var result = new Promise(resolve => {
        pdf.create(html, options).toFile((err, file) => {
          if (err) throw new Error('erro');
          var stream = fs.createReadStream(file.filename);
          console.log(stream);
          resolve(stream);
        })
      });
      return await result;
    }
  })
}

