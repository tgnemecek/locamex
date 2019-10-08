const locamexSignature = [
  {text: `__________________________________`, alignment: 'center'},
  {text: `Jurgen Nemecek Junior`, style: 'sig'},
  {text: `Locamex Locações e Obras Eireli - EPP`, style: 'sig'},
  {text: `LOCADORA`, style: 'sig', margin: [0, 0, 0, 30]}
]

export default function signatures(props) {
  if (props.client.type === "company") return companySignatures(props);
  if (props.client.type === "person") return personSignatures(props);
}

function companySignatures(props) {
  const clientSignature = () => {
    var array = props.representatives.map((rep) => {
      return [
        {text: `__________________________________`, alignment: 'center'},
        {text: rep.name, style: 'sig'},
        {text: props.client.officialName, style: 'sig'},
        {text: `LOCATÁRIA`, style: 'sig', margin: [0, 0, 0, 30]}]
    })
    return {columns: array, style: 'sigDiv', headlineLevel: 700}
  }
  if (props.representatives.length === 1) {
    return {columns:
      [
        locamexSignature,
        clientSignature()
      ],
      headlineLevel: 700
    }
  } else return {stack: locamexSignature.concat(clientSignature()), headlineLevel: 600}
}

function personSignatures(props) {
  const clientSignature = () => {
    var array = [
      [{text: `__________________________________`, alignment: 'center'},
      {text: props.client.description, style: 'sig'},
      {text: `LOCATÁRIA`, style: 'sig', margin: [0, 0, 0, 30]}]]
    return {columns: array, style: 'sigDiv'}
  }
  return {columns:
    [
      locamexSignature,
      clientSignature()
    ],
    headlineLevel: 700
  }
}