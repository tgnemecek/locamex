export default function (type, index, length) {
  var string = "";
  if (type === "billingProducts") {
    string = `${index+1} DE ${length}`;
  } else if (type === "billingProrogation") {
    string = `PRORROGAÇÃO #${index+1}`
  }
  return [
    {text: `FATURA DE LOCAÇÃO DE MÓDULOS HABITÁVEIS ${string}`, style: 'h1'}
  ]
}