var pdfmake = require('pdfmake/build/pdfmake');
var vfs_fonts = require('pdfmake/build/vfs_fonts');

import tools from '/imports/startup/tools/index';
import moment from 'moment';

import header from './header/index';
import tableInformation from './table-information/index';
import observations from './observations/index';
import tableProducts from './table-products/index';
import tableServices from './table-services/index';
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
    img.setAttribute('crossOrigin', 'Anonymous');
    img.src = 'https://locamex-app.s3-sa-east-1.amazonaws.com/app-required/logo-locamex-slogan-400x251.png';
    img.onload = function () {
      var canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve({dataURL, canvas});
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
      observations(data),
      tableProducts(data),
      tableServices(data),
      tableTotalValue(data),
      conditions(data),
      documentsNeeded(data),
      closing(),
      signature()
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
  logoLoader.then((result) => {
    docDefinition.header = {columns: [
      {image: result.dataURL, width: 110},
      {text: [
        'LOCAMEX - Escritório\n',
        'Rua Monsenhor Antônio Pepe, 52 - Parque Jabaquara\n',
        'CEP: 04357-080 - São Paulo - SP\n',
        'Tel. (11) 5532-0790 / 5533-5614 / 5031-4762 / 3132-7175\n',
        {text: 'locamex@locamex.com.br', link: 'mailto:locamex@locamex.com.br'}
      ], style: 'p', alignment: 'right'}
    ], margin: [30, 30, 30, 30]}
    result.canvas.parentNode.removeChild(result.canvas);
    pdfMake.createPdf(docDefinition).download(fileName);
  }).catch(() => {
    pdfMake.createPdf(docDefinition).download(fileName);
  })
}