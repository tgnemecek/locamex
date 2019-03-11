var pdfmake = require('pdfmake/build/pdfmake');
var vfs_fonts = require('pdfmake/build/vfs_fonts');

import tools from '/imports/startup/tools/index';
import moment from 'moment';

import resultFormat from './result-format/index';
import styles from './styles/index';

import text from './text/index';
import tableInformationCompany from './table-information-company/index';
import tableRepresentatives from './table-representatives/index';
import tableProducts from './table-products/index';
import tableServices from './table-services/index';
import tableDuration from './table-duration/index';
import tableBillingProducts from './table-billing-products/index';
import tableBillingServices from './table-billing-services/index';
import tableAddress from './table-address/index';
import tableRestitution from './table-restitution/index';
import date from './date/index';
import signatures from './signatures/index';
import tableWitnesses from './table-witnesses/index';

export default function createPdf(contract, client, negociator, representatives, version) {

  const fileName = `Locamex - Contrato de Locação #${contract._id}_${version}`;

  const products = contract.containers.concat(contract.accessories).map((item) => {
    item.monthlyPrice = item.quantity * item.price;
    item.finalPrice = item.monthlyPrice * contract.dates.duration;
    return item;
  });
  const services = contract.services.map((item) => {
    item.finalPrice = item.quantity * item.price;
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

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 40, 30, 40, 45 ], //[left, top, right, bottom]
    info: {
      title: `Contrato Locamex #${contract._id}.${version}`,
      author: `Locamex`,
      subject: `Contrato de Locação de Bens Móveis e Prestação de Serviços`
    },
    content: [
      text(0, contract._id, undefined, version),
      tableInformationCompany(client, negociator, styles),
      tableRepresentatives(representatives, styles),
      text(1, undefined, contract.proposal),
      tableProducts(products, contract.dates, contract.discount, totalValueProrogation, totalValueProducts, resultFormat, styles),
      text(2),
      tableServices(services, totalValueServices, resultFormat, styles),
      text(3),
      tableDuration(contract.dates, styles),
      text(4),
      tableBillingProducts(contract.billingProducts, totalValueProducts, resultFormat, styles),
      text(5),
      tableBillingServices(contract.billingServices, totalValueServices, contract.inss, contract.iss, resultFormat, styles),
      text(6),
      tableAddress(contract.deliveryAddress, styles),
      text(7),
      tableRestitution(products, resultFormat, styles),
      text(8),
      date(),
      signatures(representatives, client),
      tableWitnesses(styles)
    ],
    pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      if (currentNode.style == "table" || currentNode.style == "keep") {
        if (currentNode.pageNumbers.length > 1) return true;
      } else return false;
    },
    footer: (currentPage, pageCount) => {
      return {text: [
          {text: `Contrato de Locação de Bens Móveis e Prestação de Serviços nº ${contract._id}.${version}\n`},
          {text: (currentPage + "/" + pageCount)}
        ], style: 'footer'};
    },
    styles
};
  pdfMake.createPdf(docDefinition).download(fileName);
}