import tools from '/imports/startup/tools/index';

export default function tableModules(props) {
  var filtered = props.packs.filter((pack) => {
    return !pack.place
  })
  if (!filtered.length) return null;

  var preparedModules = []
  props.packs.forEach((pack) => {
    pack.modules.forEach((module) => {
      if (module.places) {
        module.places.forEach((place) => {
          var found = preparedModules.find((item) => {
            return (module.description === item.moduleDescription) &&
              place.description === item.place;
          })
          if (found) {
            found.quantity += place.quantity;
          } else {
            preparedModules.push({
              quantity: place.quantity,
              // containerDescription: pack.container.description,
              moduleDescription: module.description,
              series: pack.description,
              place: place.description
            })
          }
        })
      }
    })
  })




  const body = () => {
    return preparedModules.map((module) => {
      return [
        [
          {text: module.quantity, alignment: "center"},
          module.moduleDescription,
          module.place,
          ' '
        ]
      ]
    })
  }

  return [
    {text: "Componentes", style: "h2"},
    props.generateTable({
      header: [
        [
        {text: 'Qtd', alignment: "center"},
        'Produto',
        'Pátio',
        {text: '!', alignment: "center"}
      ]
    ],
      body: body(),
      widths: ['auto', '*', 150, 16]
    })
  ]
}