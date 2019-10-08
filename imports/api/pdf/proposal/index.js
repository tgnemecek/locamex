import tools from '/imports/startup/tools/index';
import moment from 'moment';

import title from './title/index';
import tableInformation from './table-information/index';
import observations from './observations/index';
import tableProducts from './table-products/index';
import tableServices from './table-services/index';
import tableTotalValue from './table-total-value/index';
import conditions from './conditions/index';
import notIncluded from './not-included/index';
import documentsNeeded from './documents-needed/index';
import closing from './closing/index';
import signature from './signature/index';

function resultFormat(input) {
  return {text: tools.format(input, 'currency'), alignment: 'right', bold: true};
}

export default function proposalPdf(props) {
  const proposal = props.master;

  const fileName = `Locamex - Proposta de Locação #${proposal._id}_${Number(proposal.version)+1}.pdf`;

  const products = proposal.containers.concat(proposal.accessories).map((item) => {
    item.monthlyPrice = item.renting * item.price;
    if (proposal.dates.timeUnit === "months") {
      item.finalPrice = item.monthlyPrice * proposal.dates.duration;
    } else item.finalPrice = item.monthlyPrice;

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

  return {
    fileName,
    pageSize: 'A4',
    pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
    info: {
      title: `Proposta para Locação de Módulos Habitáveis (Containers)`,
      author: `Locamex`,
      subject: `Proposta de Locação de Containers`
    },
    header: props.header(),
    content: [
      title(data),
      tableInformation(data),
      observations(data),
      tableProducts(data),
      tableServices(data),
      tableTotalValue(data),
      conditions(data),
      notIncluded(),
      documentsNeeded(data),
      closing(),
      signature(data)
    ],
    footerStatic: `Proposta de Locação de Bens Móveis e Prestação de Serviços nº ${proposal._id}.${Number(proposal.version)+1}\n`,
    styles
  }
}