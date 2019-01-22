export default function signatures(representatives, client) {
  const locamexSignature = [
    {text: `__________________________________`, alignment: 'center'},
    {text: `Jurgen Nemecek Junior`, style: 'sig'},
    {text: `Locamex Locações e Obras Eireli - EPP`, style: 'sig'},
    {text: `LOCADORA`, style: 'sig', margin: [0, 0, 0, 30]}
  ]
  const clientSignature = () => {
    var array = representatives.map((rep) => {
      return [
        {text: `__________________________________`, alignment: 'center'},
        {text: rep.name, style: 'sig'},
        {text: client.officialName, style: 'sig'},
        {text: `LOCATÁRIA`, style: 'sig', margin: [0, 0, 0, 30]}]
    })
    return {columns: array, style: 'sigDiv'}
  }
  if (representatives.length === 1) {
    return {columns:
      [
        locamexSignature,
        clientSignature()
      ]
    }
  } else return locamexSignature.concat(clientSignature());
}