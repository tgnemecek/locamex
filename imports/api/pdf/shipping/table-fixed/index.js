import tools from '/imports/startup/tools/index';

export default function tableFixed(props) {
  if (!props.series.length) return null;

  const body = () => {
    return props.series.map((series) => {
      return [
        [
          {text: '1', alignment: "center"},
          series.container.description,
          {text: series.description, alignment: "center"},
          series.place.description,
          ' '
        ]
      ]
    })
  }

  return [
    {text: "Containers Fixos", style: "h2"},
    props.generateTable({
      header: [
        [
        {text: 'Qtd', alignment: "center"},
        'Produto',
        {text: 'Série', alignment: "center"},
        'Pátio',
        {text: '!', alignment: "center"}
      ]
    ],
      body: body(),
      widths: ['auto', '*', 'auto', 'auto', 16]
    })
  ]
}