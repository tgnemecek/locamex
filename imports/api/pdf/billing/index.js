import tools from '/imports/startup/tools/index';
import moment from 'moment';

import title from './title/index';
import tableInformation from './table-information/index';
import tableClient from './table-client/index';
import conditions from './conditions/index';
import tableProducts from './table-products/index';
import tableAddress from './table-address/index';
import tableCharge from './table-charge/index';
import notService from './not-service/index';
import observations from './observations/index';

export default function billingPdf(props) {
  try {
    const contract = props.master;
    const generateTable = props.generateTable;
    const styles = props.styles;
    const charge = props.charge;

    const products = contract.containers.concat(contract.accessories).map((item) => {
      item.monthlyPrice = item.quantity * item.price;
      return item;
    });
    const totalValueProducts = products.length ? (products.reduce((acc, current) => {
      return acc + current.monthlyPrice;
    }, 0) * (1 - contract.discount)) : 0;

    function resultFormat(input) {
      return {text: tools.format(input, 'currency'), alignment: 'right', bold: true};
    }

    const fileName = `Locamex - Contrato #${contract._id}_${contract.activeVersion} - Fatura ${charge.index+1} de ${charge.length}.pdf`;

    var data = {
      ...contract,
      charge,
      products,
      totalValueProducts,
      generateTable,
      resultFormat,
      styles
    }

    return {
      fileName,
      pageSize: 'A4',
      pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
      info: {
        title: `Fatura ${charge.index+1} de ${charge.length} - Locamex #${contract._id}.${Number(contract.version)}`,
        author: `Locamex`,
        subject: `Fatura de Locação de Bens Móveis`
      },
      header: props.header(),
      content: [
        title(data),
        tableInformation(data),
        tableClient(data),
        conditions(data),
        tableProducts(data),
        tableAddress(data),
        tableCharge(data),
        notService(),
        observations(data)
      ],
      footerStatic: `Locamex - Contrato #${contract._id}.${contract.activeVersion} - Fatura ${charge.index+1} de ${charge.length}\n`,
      styles
    };
  }
  catch(err) {
    console.log(err);
  }
}