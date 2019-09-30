import tools from '/imports/startup/tools/index';

export default function tableServices(props) {

  const body = () => {
    return props.services.map((service, i) => {
      return [
        (i+1),
        service.description,
        {text: tools.format(service.price, 'currency'), alignment: 'right'},
        {text: service.renting, alignment: 'center'},
        {text: tools.format(service.finalPrice, 'currency'), alignment: 'right'}
      ];
    });
  }

  return [
    {text: 'Pacote de Serviços', style: 'h2', alignment: 'center'},
    props.generateTable({
      header: [[
        '#',
        'Descrição',
        {text: 'Valor Unitário', alignment: 'right'},
        {text: 'Qtd.', alignment: 'center'},
        {text: 'Valor Total', alignment: 'right'}
      ]],
      body: body(),
      footer: [[
        {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, props.resultFormat(props.totalValueServices)
      ]],
      widths: [ 'auto', '*', 60, 'auto', 60 ],
      styles: props.styles
    })
  ]
}

