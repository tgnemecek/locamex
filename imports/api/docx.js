import { Meteor } from 'meteor/meteor';

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

if(Meteor.isServer) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');

  Meteor.methods({
    docx(a)  {
      dir = __dirname;
      // console.log(dir);
      // console.log(fs.statSync(dir));
      fs.readdir(dir, (err, files) => {
        files.forEach(file => {
          console.log(file);
        });
      })
      // //Load the docx file as a binary
      // var content = fs
      //     // .readFileSync('D:\meteor-projects\locamex\imports\api\input.docx', 'binary');
      //     // .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');
      //     .readFileSync((dir + 'input.docx'), 'binary');
      //
      // var zip = new JSZip(content);
      //
      // var doc = new Docxtemplater();
      // doc.loadZip(zip);
      //
      // //set the templateVariables
      // doc.setData({
      //     first_name: 'John',
      //     last_name: 'Doe',
      //     phone: '0652455478',
      //     description: 'New Website'
      // });
      //
      // try {
      //     // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      //     doc.render()
      // }
      // catch (error) {
      //     var e = {
      //         message: error.message,
      //         name: error.name,
      //         stack: error.stack,
      //         properties: error.properties,
      //     }
      //     console.log(JSON.stringify({error: e}));
      //     // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      //     throw error;
      // }
      //
      // var buf = doc.getZip()
      //              .generate({type: 'nodebuffer'});
      //
      // // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      // fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
    }
  })
}

