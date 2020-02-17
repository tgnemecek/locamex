export default function (props) {
  var string = "";
  if (props.type === "send") {
    string = `ENVIO`;
  } else if (props.type === "receive") {
    string = `DEVOLUÇÃO`;
  }
  return [
    {text: `RELATÓRIO DE ITENS #${props.index+1} - ${string} - #${props.contractId}`, style: 'h1'}
  ]
}