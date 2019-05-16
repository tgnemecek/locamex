import tools from '/imports/startup/tools/index';

export default function tableServices(props) {
  const renderBody = () => {
    var header = [ [
      '#',
      'Descrição',
      {text: 'Valor Unitário', alignment: 'left'},
      {text: 'Qtd.', alignment: 'center'},
      {text: 'Valor Total', alignment: 'right'}
    ] ];
    var body = props.services.map((service, i) => {
      return [ (i+1), service.description, tools.format(service.price, 'currency'), {text: service.renting, alignment: 'center'}, props.resultFormat(service.finalPrice)];
    });
    var footer = [
      [ {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', props.resultFormat(props.totalValueServices)]
    ];
    return header.concat(body, footer);
  }
  return {table: {
    headerRows: 1,
    widths: [ 'auto', '*', 'auto', 'auto', 'auto' ],
    heights: props.styles.cellheight,
    body: renderBody(),
  }, style: 'table'}
}

