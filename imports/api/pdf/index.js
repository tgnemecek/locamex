import { Meteor } from 'meteor/meteor';

const PdfPrinter = require('pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');

import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Services } from '/imports/api/services/index';

import contractPdf from './contract/index';
import proposalPdf from './proposal/index';
import billingPdf from './billing/index';
import flyerPdf from './flyer/index';
import shippingPdf from './shipping/index';

import generateTable from './generate-table/index';
import header from './header/index';
import styles from './styles/index';

var printer = new PdfPrinter({
  Roboto: {
    normal: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
    bold: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
    italics: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64')
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    async 'pdf.generate'(master) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      try {
        var docDefinition = generateDocDefinition(master).await();
        docDefinition.pageBreakBefore = setPageBreaks();
        docDefinition.footer = docDefinition.footer || generateFooter(docDefinition);

        var buffer = generateBuffer(docDefinition).await();
        var prefix = 'data:application/pdf;base64,';
        var data = prefix + buffer.toString('base64');

        return {
          data,
          fileName: docDefinition.fileName
        };
      }
      catch(err) {
        throw new Meteor.Error(err.error);
      }
    }
  })
}

// Main function
function generateDocDefinition(master) {
  // Initial possible errors
  if (!master) throw new Meteor.Error('no-master');
  if (!master.type) throw new Meteor.Error('no-master-type');
  if (!Meteor.isServer) throw new Meteor.Error('import-server-only');
  // Decide which function to use
  var generator;
  switch (master.type) {
    case 'proposal':
      generator = generateProposal;
      break;
    case 'contract':
      generator = generateContract;
      break;
    case 'billing':
      generator = generateBilling;
      break;
    case 'flyer':
      generator = generateFlyer;
      break;
    case 'send':
    case 'receive':
      generator = generateShipping;
      break;
  }
  // Generate docDefinition
  return new Promise((resolve, reject) => {
    generator(master).then((result) => {
      resolve({
        ...result,
        styles
      })
    })
  }).catch((err) => {
    console.log(err);
  })
}

// Sub-functions
function generateProposal(master) {
  return new Promise((resolve, reject) => {
    var props = {
      master,
      generateTable,
      header,
      styles
    }

    try {
      if (master.includeFlyer) {
        var promises = master.containers.map((container) => {
          return new Promise((resolve, reject) => {
            getFlyerImages(container).then((images) => {
              var item = Containers.findOne({
                _id: container.productId
              });
              var flyer = flyerPdf({...item, images}, header)
              var flyerDoc = [];
              if (flyer) {
                flyerDoc = flyer.content;
                flyerDoc.unshift({text: '', pageBreak: 'after'});
              }
              resolve(flyerDoc);
            })
          })
        })
        Promise.all(promises).then((flyersDocs) => {
          var proposalDoc = proposalPdf(props);
          proposalDoc.content = proposalDoc.content.concat(flyersDocs);
          resolve(proposalDoc);
        })
      } else resolve(proposalPdf(props));
    }
    catch(err) {
      reject(err);
    }
  })
}

function generateContract(master) {
  return new Promise((resolve, reject) => {
    try {
      master = getSignatures(master);
      var props = {
        master,
        generateTable,
        styles
      }

      resolve(contractPdf(props));
    } catch(err) {
      reject(err);
    }
  })
}

function generateBilling(master) {
  return new Promise((resolve, reject) => {

    var props = {
      master,
      header,
      charge: master.charge,
      generateTable,
      styles
    }

    resolve(billingPdf(props));
  })
}

function generateShipping(master) {
  return new Promise((resolve, reject) => {
    var props = {
      master,
      header,
      generateTable,
      styles
    }

    resolve(shippingPdf(props));
  })
}

function generateFlyer(master) {
  return new Promise((resolve, reject) => {
    getFlyerImages(master).then((images) => {
      var item = Containers.findOne({ _id: master._id });
      resolve(flyerPdf({...item, images}, header));
    });
  })
}

// Other functions
function getCreatedBy(userId) {
  var usersDatabase = Meteor.users.find().fetch();
  if (!usersDatabase) throw new Meteor.Error("userDB-not-found!");

  var user = usersDatabase.find((user) => {
    return user._id === userId;
  })
  if (!user) return '';

  return user.firstName + " " + user.lastName;
}

function getSignatures(master) {
  master.representatives = [];

  if (master.client.type === "company") {
    master.client.contacts.forEach((contact) => {
      if (contact._id === master.negociatorId) {
        master.negociator = contact;
      }
      if (master.representativesId.includes(contact._id)) {
        master.representatives.push(contact);
      }
    });
  }
  return master;
}

function getAccount(master, billingName) {
  var charge = master[billingName][0];
  if (!charge) return {};
  var accountId = charge.accountId;
  var account = Accounts.findOne({ _id: accountId });
  if (!account) throw new Meteor.Error('account-not-found!');

  return account;
}

function setPageBreaks() {
  return function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
    if (currentNode.headlineLevel) {
      var limit = currentNode.headlineLevel;
      return (currentNode.startPosition.top > limit);
    }
  }
}

function generateFooter(docDefinition) {
  return (currentPage, pageCount) => {
    return {text: [
        {text: docDefinition.footerStatic || ''},
        {text: (currentPage + "/" + pageCount)}
      ], style: 'footer'};
  }
}

function getFlyerImages(item) {
  var promises = [];
  if (!item.flyer) return Promise.resolve([]);

  item.flyer.images.forEach((image) => {
    promises.push(new Promise((resolve, reject) => {
      Meteor.call('aws.read', image, (err, res) => {
        if (res) {
          var buffer = Buffer.from(res.Body);
          var prefix = 'data:image/jpeg;base64,';
          var data = prefix + buffer.toString('base64');
          resolve(data);
        }
        if (err) {
          console.log(err);
          reject(err);
        }
      })
    }))
  })
  return Promise.all(promises).catch((err) => {
    console.log(err);
  })
}

function generateBuffer(docDefinition) {
  return new Promise((resolve, reject) => {
    try {
      var chunks = [];
      var result;
      var options = {
        footer: docDefinition.footer
      }
      var pdfDoc = printer.createPdfKitDocument(docDefinition, options);

      pdfDoc.on('data', function (chunk) {
        chunks.push(chunk);
      });
      pdfDoc.on('end', function () {
        result = Buffer.concat(chunks);
        resolve(result);
      });
      pdfDoc.end();
    }
    catch(err) {
      console.log(err);
      throw new Meteor.Error(err.name, err.message);
    }
  })
}