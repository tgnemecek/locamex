import tools from '/imports/startup/tools/index';
import moment from 'moment';

import title from './title/index';
import date from './date/index';
import tableSeries from './table-series/index';
import tableModules from './table-modules/index';
import tableVariations from './table-variations/index';
import signature from './signature/index';

export default function shippingPdf(props) {
  try {
    const master = props.master;
    const generateTable = props.generateTable;
    const styles = props.styles;

    const fileName = `Locamex - Relatório de Itens #${master.contractId}.pdf`;

    var data = {
      ...master,
      generateTable,
      styles
    }

    return {
      fileName,
      pageSize: 'A4',
      pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
      info: {
        title: `Relatório de Itens #${master.index+1} - ${master.contractId}`,
        author: `Locamex`,
        subject: `Relatório de Itens`
      },
      header: props.header(),
      content: [
        title(data),
        date(),
        tableSeries(data),
        tableModules(data),
        tableVariations(data)
      ],
      footer: signature(),
      styles
    };
  }
  catch(err) {
    console.log(err);
  }
}