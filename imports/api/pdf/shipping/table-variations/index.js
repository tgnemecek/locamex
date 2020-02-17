import tools from '/imports/startup/tools/index';

export default function tableVariations(props) {
  if (!props.variations.length) return null;

  const body = () => {
    return props.variations.map((variation) => {
      return variation.places.map((place) => {
        return [
          {text: place.quantity, alignment: "center"},
          variation.accessory.description,
          {text: variation.description, alignment: "center"},
          place.description,
          ' '
        ]
      })
    })
  }

  return [
    {text: "Acessórios", style: "h2"},
    props.generateTable({
      header: [
        [
        {text: 'Qtd', alignment: "center"},
        'Produto',
        {text: 'Variação', alignment: "center"},
        'Pátio',
        {text: '!', alignment: "center"}
      ]
    ],
      body: body(),
      widths: ['auto', '*', 80, 150, 16]
    })
  ]
}