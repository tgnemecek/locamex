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
    const item = props.master.item;
    const styles = props.styles;

    var fileName = `Locamex - Folder_${tools.makeValidFileName(item.description)}.pdf`;

    return {
      fileName,
      pageSize: 'A4',
      pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
      info: {
        title: `Folder: ${item.description}`,
        author: `Locamex`,
        subject: `Folder de Produto`
      },
      header: props.header(),
      content: [
        {text: item.description.toUpperCase(), style: 'h1'},
        {text: item.flyer.paragraphs[0]},
        {text: item.flyer.paragraphs[1]},
        {text: item.flyer.paragraphs[2]},
        {image: props.master.images[0]},
        {image: props.master.images[1]}
        //
        // tableInformation(data),
        // tableClient(data),
        // conditions(data),
        // tableProducts(data),
        // tableAddress(data),
        // tableCharge(data),
        // notService(),
        // observations(data)
      ],
      styles
    };
  }
  catch(err) {
    console.log(err);
  }
}