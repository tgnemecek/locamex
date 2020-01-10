import tools from '/imports/startup/tools/index';

export default function tableItems(props) {
  const body = () => {
    return props.list.map((item, i) => {
      if (!item.subList) {
        return [
          item.quantity,
          item.description,
          {text: item.series || "", alignment: "center"},
          "",
          {text: item.variation || "", alignment: "center"},
          {text: item.place || "", alignment: "center"},
          ''
        ];
      } else {
        var result = item.subList.map((subItem) => {
          return [
            subItem.quantity,
            {ul: [subItem.description]},
            '',
            '',
            '',
            {text: subItem.place || "", alignment: "center"},
            ''
          ]
        });
        result.unshift([
          item.quantity,
          item.description,
          '',
          {text: item.label || "", alignment: "center"},
          '',
          '',
          ''
        ])
        return result;
      }
    })
  }

  return [
    props.generateTable({
      header: [
        [
        'Qtd',
        'Item',
        {text: 'Série', alignment: "center"},
        {text: 'Etiqueta', alignment: "center"},
        {text: 'Padrão', alignment: "center"},
        {text: 'Pátio', alignment: "center"},
        ' '
      ]
    ],
      body: body(),
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 32]
    })
  ]
}