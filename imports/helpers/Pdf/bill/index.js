import tools from '/imports/startup/tools/index';
import moment from 'moment';

import header from './header/index';
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

export default function createPdf(props) {

  const contract = props.master;
  const generateTable = props.generateTable;
  const styles = props.styles;
  const charge = props.charge;

  const logoLoader = new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute('crossOrigin', 'Anonymous');
    img.src = 'https://locamex-app.s3-sa-east-1.amazonaws.com/app-required/logo-locamex-slogan-400x251.png';
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve({dataURL, canvas});
    };
    setTimeout(() => reject(), 5000);
  })

  const fileName = `Locamex - Contrato #${contract._id}_${contract.activeVersion} - Fatura ${charge.index+1} de ${charge.length}.pdf`;

  var data = {
    ...contract,
    charge,
    generateTable,
    styles
  }

  var docDefinition = {
    fileName,
    pageSize: 'A4',
    pageMargins: [ 40, 110, 40, 45 ], //[left, top, right, bottom]
    info: {
      title: `Fatura ${charge.index+1} de ${charge.length} - Locamex #${contract._id}.${Number(contract.version)}`,
      author: `Locamex`,
      subject: `Contrato de Locação de Bens Móveis e Prestação de Serviços`
    },
    content: [
      header(data),
      tableInformation(data),
      conditions(data),
      // tableProducts(data),
      // observations(data),
      // tableServices(data),
      // tableTotalValue(data),
      // notIncluded(),
      // documentsNeeded(data),
      // closing(),
      // signature(data)
    ],
    footerStatic: `Contrato de Locação de Bens Móveis e Prestação de Serviços nº ${contract._id}.${Number(contract.version)}\n`,
    styles
  };
  return new Promise((resolve, reject) => {
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
      resolve(docDefinition);
    }).catch(() => {
      reject("error-in-logo");
    })
  })
}