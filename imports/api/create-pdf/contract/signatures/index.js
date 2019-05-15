const locamexSignature = [
  {text: `__________________________________`, alignment: 'center'},
  {text: `Jurgen Nemecek Junior`, style: 'sig'},
  {text: `Locamex Locações e Obras Eireli - EPP`, style: 'sig'},
  {text: `LOCADORA`, style: 'sig', margin: [0, 0, 0, 30]}
]

export default function signatures(contract) {
  if (contract.client.type === "company") return companySignatures(contract);
  if (contract.client.type === "person") return personSignatures(contract);
}

function companySignatures(contract) {
  const clientSignature = () => {
    var array = contract.representatives.map((rep) => {
      return [
        {text: `__________________________________`, alignment: 'center'},
        {text: rep.name, style: 'sig'},
        {text: contract.client.officialName, style: 'sig'},
        {text: `LOCATÁRIA`, style: 'sig', margin: [0, 0, 0, 30]}]
    })
    return {columns: array, style: 'sigDiv'}
  }
  if (contract.representatives.length === 1) {
    debugger;
    return {columns:
      [
        locamexSignature,
        clientSignature()
      ]
    }
  } else return locamexSignature.concat(clientSignature());
}

function personSignatures(contract) {
  const clientSignature = () => {
    var array = [
      [{text: `__________________________________`, alignment: 'center'},
      {text: contract.client.description, style: 'sig'},
      {text: `LOCATÁRIA`, style: 'sig', margin: [0, 0, 0, 30]}]]
    return {columns: array, style: 'sigDiv'}
  }
  return {columns:
    [
      locamexSignature,
      clientSignature()
    ]
  }
}