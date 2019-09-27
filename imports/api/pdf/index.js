import { Meteor } from 'meteor/meteor';
import { Containers } from '/imports/api/containers/index';
const PdfPrinter = require('pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');
const hummus = require('hummus');
const memoryStreams = require('memory-streams');

var printer = new PdfPrinter({
  Roboto: {
    normal: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
    bold: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
    italics: new Buffer(vfs_fonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64')
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    'pdf.contract.create'(docDefinition) {
      docDefinition.footer = generateFooter(docDefinition);
      docDefinition.pageBreakBefore = setPageBreaks();
      return new Promise((resolve, reject) => {
        generateBuffer(docDefinition).then((res) => {
          resolve('data:application/pdf;base64,' + res.toString('base64'));
        });
      })
    },
    'pdf.proposal.create'(docDefinition, containers) {
      return new Promise((resolve, reject) => {
        try {
          docDefinition.footer = generateFooter(docDefinition);
          docDefinition.pageBreakBefore = setPageBreaks();

          getFlyers(containers).then((buffers) => {
            generateBuffer(docDefinition).then((res) => {
              var outStream = new memoryStreams.WritableStream();
              var firstPDFStream = new hummus.PDFRStreamForBuffer(res);
              var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));

              buffers.forEach((buffer) => {
                var stream = new hummus.PDFRStreamForBuffer(buffer);
                pdfWriter.appendPDFPagesFromPDF(stream);
              })
              pdfWriter.end();
              var newBuffer = outStream.toBuffer();
              outStream.end();

              resolve('data:application/pdf;base64,' + newBuffer.toString('base64'));
            })
          })
        }
        catch (err) {
          reject(err);
        }
      })
    },
    'pdf.bill.create'(docDefinition) {
      docDefinition.footer = generateFooter(docDefinition);
      docDefinition.pageBreakBefore = setPageBreaks();
      return new Promise((resolve, reject) => {
        generateBuffer(docDefinition).then((res) => {
          resolve('data:application/pdf;base64,' + res.toString('base64'));
        });
      })
    }
  })
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
        {text: docDefinition.footerStatic},
        {text: (currentPage + "/" + pageCount)}
      ], style: 'footer'};
  }
}

function generateBuffer(docDefinition) {
  return new Promise((resolve, reject) => {
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
  })
}

function getFlyers (containers) {
  return new Promise((resolve, reject) => {
    var promises = [];
    var buffers = [];
    containers.forEach((product, i, arr) => {
      var item = Containers.findOne({ _id: product.productId });
      if (item.flyer) {
        var request = require('request').defaults({ encoding: null });
        promises.push(new Promise((resolve, reject) => {
          request.get(item.flyer, (err, res, buffer) => {
            if (err) reject(err);
            if (buffer) {
              buffers.push(buffer);
              resolve();
            }
          })
        }))
      }
    })
    Promise.all(promises).then(() => {
      resolve(buffers);
    }).catch((err) => {
      throw new Meteor.Error('error-in-flyers', err);
    })
  })
}