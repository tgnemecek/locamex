export default function (props) {
  var monthlyValue = props.dates.timeUnit === "months" ? `Valor Mensal de Locação e o` : ``;
  return [
    {text: `CLÁUSULA PRIMEIRA - DO OBJETO DO CONTRATO`, style: 'h2'},
    {text: `Por meio deste contrato, que firmam entre si a LOCADORA e a LOCATÁRIA, regula-se a locação dos seguintes bens assim como a prestação de serviços associados.`, style: 'p'},
    {text: `§ 1º. Define-se como Objeto da Locação os seguintes itens, assim como o ${monthlyValue} Valor Total da Locação:`, style: 'p'}
  ]
}