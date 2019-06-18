import tools from '/imports/startup/tools/index';

export default function tableServices(props) {

  const body = () => {
    return props.services.map((service, i) => {
      return [
        (i+1), service.description, tools.format(service.price, 'currency'), {text: service.renting, alignment: 'center'}, props.resultFormat(service.finalPrice)
      ];
    });
  }

  return [
    {text: 'Pacote de Serviços', style: 'h2', alignment: 'center'},
    props.generateTable({
      header: [
        '#',
        'Descrição',
        {text: 'Valor Unitário', alignment: 'left'},
        {text: 'Qtd.', alignment: 'center'},
        {text: 'Valor Total', alignment: 'right'}
      ],
      body: body(),
      footer: [
        {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, props.resultFormat(props.totalValueServices)
      ],
      widths: [ 'auto', '*', 'auto', 'auto', 'auto' ],
      styles: props.styles
    })
  ]
}

