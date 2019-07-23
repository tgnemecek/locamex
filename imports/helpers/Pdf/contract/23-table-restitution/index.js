import tools from '/imports/startup/tools/index';

export default function tableRestitution(props) {
  const renderBody = () => {
    var header = [ ['#', 'Descrição', {text:'Valor Unitário de Indenização', alignment: 'right'}] ];
    var body = props.products ? props.products.map((product, i) => {
      return [ (i+1), product.description, props.resultFormat(product.restitution) ]
    }) : [[ {text: '', colSpan: 4}, '', '', '' ]];
    return header.concat(body);
  }
  return {table: {
    headerRows: 1,
    widths: ['auto', '*', 'auto'],
    heights: props.styles.cellheight,
    body: renderBody()
  }, style: 'table'}
}