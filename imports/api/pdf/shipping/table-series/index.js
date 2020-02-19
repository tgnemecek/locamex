import tools from '/imports/startup/tools/index';

export default function tableSeries(props) {
  var packs = props.packs.filter((pack) => {
    return pack.place;
  })
  var containers = props.series.concat(packs);
  if (!containers.length) return null;

  const body = () => {
    return containers.map((item) => {
      var description = item.container.description;
      if (props.type === 'receive' && item.type === `pack`) {
        if (item.unmount) {
          description += " (desmontar)";
        } else description += " (manter montado)";
      }
      return [
        [
          {text: '1', alignment: "center"},
          description,
          {text: item.description, alignment: "center"},
          item.place.description,
          ' '
        ]
      ]
    })
  }

  return [
    {text: "Containers", style: "h2"},
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
      widths: ['auto', '*', 80, 150, 16]
    })
  ]
}