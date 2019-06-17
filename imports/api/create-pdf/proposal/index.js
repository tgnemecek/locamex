var pdfmake = require('pdfmake/build/pdfmake');
var vfs_fonts = require('pdfmake/build/vfs_fonts');

import tools from '/imports/startup/tools/index';
import moment from 'moment';

import header from './1-header/index';
import tableInformation from './3-table-information/index';
import tableRepresentatives from './4-table-representatives/index';
import declaration from './5-declaration/index';
import clause1p1 from './6-clause-1-p1/index';
import tableProducts from './7-table-products/index';
import clause1p2 from './8-clause-1-p2/index';
import tableServices from './9-table-services/index';
import observations from './10-observations/index';
import clause1p3p4 from './11-clause-1-p3-p4/index';
import clause2 from './12-clause-2/index';
import tableDuration from './13-table-duration/index';
import clause2p1p2 from './14-clause-2-p1-p2/index';
import clause3p1 from './15-clause-3-p1/index';
import tableBillingProducts from './16-table-billing-products/index';
import clause3p2p3p4p5 from './17-clause-3-p2-p3-p4-p5/index';
import tableBillingServices from './18-table-billing-services/index';
import clause3p6p7p8p9 from './19-clause-3-p6-p7-p8-p9/index';
import clause4 from './20-clause-4/index';
import tableAddress from './21-table-address/index';
import clause4p1toClause8 from './22-clause-4-p1-to-clause-8/index';
import tableRestitution from './23-table-restitution/index';
import clause9toClause12 from './24-clause-9-to-clause-12/index';
import date from './25-date/index';
import signatures from './26-signatures/index';
import tableWitnesses from './27-table-witnesses/index';

import introduction from './introduction/index';
import tableTotalValue from './table-total-value/index';
import conditions from './conditions/index';
import documentsNeeded from './documents-needed/index';
import closing from './closing/index';
import signature from './signature/index';

function resultFormat(input) {
  return {text: tools.format(input, 'currency'), alignment: 'right', bold: true};
}

export default function createPdf(props) {

  const logoLoader = new Promise((resolve, reject) => {
    var img = new Image();
    img.src = 'https://locamex-app.s3-sa-east-1.amazonaws.com/app-required/logo-locamex-slogan-400x251.png';
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
    };
    setTimeout(() => reject(), 5000);
  })

  const proposal = props.master;

  const fileName = `Locamex - Contrato de Locação #${proposal._id}_${proposal.version}`;

  const products = proposal.containers.concat(proposal.accessories).map((item) => {
    item.monthlyPrice = item.renting * item.price;
    item.finalPrice = item.monthlyPrice * proposal.dates.duration;
    return item;
  });
  const services = proposal.services.map((item) => {
    item.finalPrice = item.renting * item.price;
    return item;
  })
  const totalValueProducts = products.length ? (products.reduce((acc, current) => {
    return acc + current.finalPrice;
  }, 0) * (1 - proposal.discount)) : 0;
  const totalValueServices = services.length ? services.reduce((acc, current) => {
    return acc + current.finalPrice;
  }, 0) : 0;
  const totalValueProrogation = products.length ? (products.reduce((acc, current) => {
    return acc + current.monthlyPrice;
  }, 0) * (1 - proposal.discount)) : 0;
  const totalValueRestitution = products.length ? products.reduce((acc, current) => {
    return acc + current.restitution;
  }, 0) : 0;
  const totalValueproposal = totalValueProducts + totalValueServices;

  const generateTable = props.generateTable;
  const styles = props.styles;

  var data = {
    ...proposal,
    fileName,
    products,
    services,
    totalValueProducts,
    totalValueServices,
    totalValueProrogation,
    totalValueRestitution,
    totalValueproposal,
    resultFormat,
    generateTable,
    styles
  }

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
    info: {
      title: `Proposta para Locação de Módulos Habitáveis (Containers)`,
      author: `Locamex`,
      subject: `Proposta de Locação de Containers`
    },
    content: [
      header(data),
      tableInformation(data),
      // introduction(data),
      // tableRepresentatives(data),
      // declaration(data),
      // clause1p1(data),
      conditions(data),
      tableProducts(data),
      // clause1p2(),
      tableServices(data),
      tableTotalValue(data),

      documentsNeeded(data),
      closing(),
      signature()
      // observations(data),
      // clause1p3p4(data),
      // clause2(),
      // tableDuration(data),
      // clause2p1p2(data),
      // clause3p1(),
      // tableBillingProducts(data),
      // clause3p2p3p4p5(data),
      // tableBillingServices(data),
      // clause3p6p7p8p9(),
      // clause4(),
      // tableAddress(data),
      // clause4p1toClause8(),
      // tableRestitution(data),
      // clause9toClause12(data),
      // date(),
      // signatures(data),
      // tableWitnesses(data)
    ],
    pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      if (currentNode.headlineLevel) {
        var limit = currentNode.headlineLevel;
        return (currentNode.startPosition.top > limit);
      }
    },
    footer: (currentPage, pageCount) => {
      return {text: [
          {text: (currentPage + "/" + pageCount)}
        ], style: 'footer'};
    },
    styles
};
  logoLoader.then((image) => {
    docDefinition.header = {columns: [
      {image: image, width: 110},
      {text: [
        'LOCAMEX - Escritório\n',
        'Rua Monsenhor Antônio Pepe, 52 - Parque Jabaquara\n',
        'CEP: 04357-080 - São Paulo - SP\n',
        'Tel. (11) 5532-0790 / 5533-5614 / 5031-4762 / 3132-7175\n',
        {text: 'locamex@locamex.com.br', link: 'mailto:locamex@locamex.com.br'}
      ], style: 'p', alignment: 'right'}
    ], margin: [30, 30, 30, 30]}
    console.log('then');
    pdfMake.createPdf(docDefinition).download(fileName);
  }).catch(() => {
    console.log('catch');
    pdfMake.createPdf(docDefinition).download(fileName);
  })
}