import { Meteor } from 'meteor/meteor';
import ReactDOMServer from 'react-dom/server';
import contractShort from '../docs/contract-short';
import FileSaver from 'file-saver';

var pdf = require('html-pdf');

if (Meteor.isClient) {
  var Buffer = require('buffer/').Buffer;
  var blob;
  export default function generatePdf() {
    function meteorCall() {
      return new Promise((resolve, reject) => {
        Meteor.call('html-pdf', (err, res) => {
          if (err) reject(err);
          if (res) {
            blob = new Blob([res], {type: 'application/pdf'});
            resolve(blob);
          }
        });
      });
    }
    async function asyncCall() {
      console.log('calling');
      var result = await meteorCall();
      FileSaver.saveAs(result, 'contrato.pdf');
      console.log(result);
    }
    asyncCall();
  }
}

if (Meteor.isServer) {
  var fs = Npm.require('fs');
  var tmp = require('tmp');

  Meteor.methods({
    async 'html-pdf'() {
      // var a = new Promise((resolve, reject) => {
      //   setTimeout(() => { resolve(1) }, 3000);
      // }).then((value) => {
      //   function c () {
      //     setTimeout(() => {return value + 1}, 1000)
      //   };
      //   return c();
      // });
      // await a;
      // console.log(a);
      // tentativa 1
      // var options = { format: 'Letter' };
      // var html = ReactDOMServer.renderToString(contractShort());
      // var result = new Promise (resolve => {
      // pdf.create(html, options).toFile((err, file) => {
      //     if (err) throw new Error('erro');
      //     console.log(1, file);
      //     resolve(file);
      //   })
      // }).then((value) => {
      //   function readFile() {
      //     fs.readFile(value.filename, (err, data) => {
      //       if (err) throw new Error('erro');
      //       console.log(2, data);
      //       return 'data';
      //     })
      //   }
      //   return readFile();
      // })
      // // return await result;
      // await result;
      // console.log(3, result);
      var options = { format: 'Letter' };
      var html = ReactDOMServer.renderToString(contractShort());
      const createFile = () => {
        return new Promise(resolve => {
          pdf.create(html, options).toFile((err, file) => {
            resolve(file);
          })
        })
      }
      const readFile = (value) => {
        return new Promise(resolve => {
          fs.readFile(value.filename, (err, data) => {
            resolve(data);
          })
        })
      }
      return await readFile(await createFile())
    }
  })
}

