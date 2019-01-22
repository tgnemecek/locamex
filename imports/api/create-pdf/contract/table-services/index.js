import tools from '/imports/startup/tools/index';

export default function tableServices(services, totalValueServices, resultFormat, styles) {
  const renderBody = () => {
    var header = [ [
      '#',
      'Descrição',
      {text: 'Valor Unitário', alignment: 'left'},
      {text: 'Qtd.', alignment: 'center'},
      {text: 'Valor Total', alignment: 'right'}
    ] ];
    var body = services.map((service, i) => {
      return [ (i+1), service.description, tools.format(service.price, 'currency'), {text: service.quantity, alignment: 'center'}, resultFormat(service.finalPrice)];
    });
    var footer = [
      [ {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', resultFormat(totalValueServices)]
    ];
    return header.concat(body, footer);
  }
  return {table: {
    headerRows: 1,
    widths: [ 'auto', '*', 'auto', 'auto', 'auto' ],
    heights: styles.cellheight,
    body: renderBody(),
  }, style: 'table'}
}

