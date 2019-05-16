var pdfmake = require('pdfmake/build/pdfmake');
var vfs_fonts = require('pdfmake/build/vfs_fonts');

import tools from '/imports/startup/tools/index';
import moment from 'moment';

import header from './1-header/index';
import definitions from './2-definitions/index';
import tableInformation from './3-table-information/index';
import declaration from './4-declaration/index';
import tableRepresentatives from './5-table-representatives/index';
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

import styles from './styles/index';


function resultFormat(input) {
  return {text: tools.format(input, 'currency'), alignment: 'right', bold: true};
}

export default function createPdf(contract) {

  const fileName = `Locamex - Contrato de Locação #${contract._id}_${contract.version}`;

  const products = contract.containers.concat(contract.accessories).map((item) => {
    item.monthlyPrice = item.renting * item.price;
    item.finalPrice = item.monthlyPrice * contract.dates.duration;
    return item;
  });
  const services = contract.services.map((item) => {
    item.finalPrice = item.renting * item.price;
    return item;
  })
  const totalValueProducts = products.length ? (products.reduce((acc, current) => {
    return acc + current.finalPrice;
  }, 0) * (1 - contract.discount)) : 0;
  const totalValueServices = services.length ? services.reduce((acc, current) => {
    return acc + current.finalPrice;
  }, 0) : 0;
  const totalValueProrogation = products.length ? (products.reduce((acc, current) => {
    return acc + current.monthlyPrice;
  }, 0) * (1 - contract.discount)) : 0;
  const totalValueRestitution = products.length ? products.reduce((acc, current) => {
    return acc + current.restitution;
  }, 0) : 0;
  const totalValueContract = totalValueProducts + totalValueServices;

  var data = {
    ...contract,
    fileName,
    products,
    services,
    totalValueProducts,
    totalValueServices,
    totalValueProrogation,
    totalValueRestitution,
    totalValueContract,
    resultFormat,
    styles
  }

  var regularContract = [
    header(data),
    definitions(data),
    tableInformation(data),
    declaration(data),
    tableRepresentatives(data),
    clause1p1(),
    tableProducts(data),
    clause1p2(),
    tableServices(data),
    observations(data),
    clause1p3p4(data),
    clause2(),
    tableDuration(data),
    clause2p1p2(),
    clause3p1(),
    tableBillingProducts(data),
    clause3p2p3p4p5(),
    tableBillingServices(data),
    clause3p6p7p8p9(),
    clause4(),
    tableAddress(data),
    clause4p1toClause8(),
    tableRestitution(data),
    clause9toClause12(),
    date(),
    signatures(data),
    tableWitnesses(data)
  ]

  var eventsContract = [ // MUDAR AQUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    header(data),
    definitions(data),
    tableInformation(data),
    declaration(data),
    tableRepresentatives(data),
    clause1p1(),
    tableProducts(data),
    clause1p2(),
    tableServices(data),
    observations(data),
    clause1p3p4(data),
    clause2(),
    tableDuration(data),
    clause2p1p2(),
    clause3p1(),
    tableBillingProducts(data),
    clause3p2p3p4p5(),
    tableBillingServices(data),
    clause3p6p7p8p9(),
    clause4(),
    tableAddress(data),
    clause4p1toClause8(),
    tableRestitution(data),
    clause9toClause12(),
    date(),
    signatures(data),
    tableWitnesses(data)
  ]

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 40, 30, 40, 45 ], //[left, top, right, bottom]
    info: {
      title: `Contrato Locamex #${contract._id}.${contract.version}`,
      author: `Locamex`,
      subject: `Contrato de Locação de Bens Móveis e Prestação de Serviços`
    },
    content: contract.dates.timeUnit === "months" ? regularContract : eventsContract,
    pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      if (currentNode.style == "table" || currentNode.style == "keep") {
        if (currentNode.pageNumbers.length > 1) return true;
      } else return false;
    },
    footer: (currentPage, pageCount) => {
      return {text: [
          {text: `Contrato de Locação de Bens Móveis e Prestação de Serviços nº ${contract._id}.${contract.version}\n`},
          {text: (currentPage + "/" + pageCount)}
        ], style: 'footer'};
    },
    styles
};
  pdfMake.createPdf(docDefinition).download(fileName);
}