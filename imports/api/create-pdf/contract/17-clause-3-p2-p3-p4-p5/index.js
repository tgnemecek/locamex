export default function (props) {
  var monthlyValue = props.dates.timeUnit === "months" ? `Valor Mensal de Locação` : `Valor Total da Locação`;
  return [
    {text: `§ 2º. Em caso de Prorrogação Automática (Cláusula Segunda, § 1º), a LOCADORA está autorizada a emitir cobranças mensais com vencimento no primeiro dia do mês equivalente ao ${monthlyValue} (Cláusula Primeira, § 1º) enquanto as partes não se manifestarem para efeito de devolução.`, style: 'p'},
    {text: `§ 3º. Durante a Prorrogação Automática, caso a LOCATÁRIA decida devolver o Objeto da Locação, ela deve informar a LOCADORA com 15 (quinze) dias de antecedência da próxima prorrogação. Caso expirado tal prazo, a LOCADORA está autorizada a emitir cobrança à LOCATÁRIA equivalente ao ${monthlyValue} do mês seguinte.`, style: 'p'},
    {text: `§ 4º. A LOCADORA não permite, sob nenhuma circunstância, qualquer subdivisão, pró-rata ou proporcionalidade do ${monthlyValue}, já que este já representa o valor mínimo relativo a qualquer período entre 1 (um) e 30 (trinta) dias de locação.`, style: 'p'},
    {text: `§ 5º. A LOCATÁRIA se obriga a pagar à LOCADORA o Valor Total do Pacote de Serviços da seguinte maneira:`, style: 'p'}
  ]
}

