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

export default function flyerPdf(props) {
  try {
    const styles = props.styles;

    var fileName = `Locamex - Folder_${tools.makeValidFileName(props.item.description)}.pdf`;

    return {
      fileName,
      pageSize: 'A4',
      pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
      info: {
        title: `Folder: ${props.item.description}`,
        author: `Locamex`,
        subject: `Folder de Produto`
      },
      header: props.header(),
      content: [
        // title(data),
        // tableInformation(data),
        // tableClient(data),
        // conditions(data),
        // tableProducts(data),
        // tableAddress(data),
        // tableCharge(data),
        // notService(),
        // observations(data)
      ],
      footerStatic: `Acesse www.LOCAMEX.com.br e veja outros modelos de Container\n`,
      styles
    };
  }
  catch(err) {
    console.log(err);
  }
}