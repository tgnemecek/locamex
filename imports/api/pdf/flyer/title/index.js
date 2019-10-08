export default function (props) {
  var string = "";
  if (props.charge.type === "billingProducts") {
    string = `${props.charge.index+1} DE ${props.charge.length}`;
  } else if (props.charge.type === "billingProrogation") {
    string = `PRORROGAÇÃO #${props.charge.index+1}`
  }
  return [
    {text: `FATURA DE LOCAÇÃO DE MÓDULOS HABITÁVEIS ${string}`, style: 'h1'}
  ]
}