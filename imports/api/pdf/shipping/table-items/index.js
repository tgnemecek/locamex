import tools from '/imports/startup/tools/index';

export default function tableItems(props) {
  function extra(item) {
    if (item.series) return "Série " + item.series;
    if (item.label) return "Etiqueta " + item.label;
    if (item.variation) return variation;
    return "";
  }
  const body = () => {
    return props.list.map((item, i) => {
      if (!item.subList) {
        return [
          item.quantity,
          item.description,
          extra(item),
          item.place || "",
          ''
        ];
      } else {
        var result = item.subList.map((subItem) => {
          return [
            subItem.quantity,
            {ul: [subItem.description]},
            extra(subItem),
            subItem.place || "",
            ''
          ]
        });
        result.unshift([
          item.quantity,
          item.description,
          extra(item),
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
        'Série/Etiqueta/Padrão',
        'Pátio',
        ' '
      ]
    ],
      body: body(),
      widths: ['auto', '*', 'auto', 'auto', 32]
    })
  ]
}