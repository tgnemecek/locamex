import tools from '/imports/startup/tools/index';

export default function tableItems(props) {
  const body = () => {
    return props.list.map((item, i) => {
      return [
        item.quantity,
        item.description,
        ''
      ];
    })
  }

  return [
    props.generateTable({
      header: [
        [
        'Qtd.',
        'Item',
        ''
      ]
    ],
      body: body(),
      widths: ['auto', '*', 32]
    })
  ]
}