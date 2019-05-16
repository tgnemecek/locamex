export default function (props) {
  var monthlyValue = props.dates.timeUnit === "months" ? 'Valor Mensal da Locação' : 'Valor Total da Locação';
  return [
    {text: `§ 1º. O contrato entrará em Prorrogação Automática se não houver manifestação da LOCATÁRIA para retirada do Objeto da Locação feita com mínimo de 15 (quinze) dias de antecedência do fim do Prazo Mínimo de Locação e o contrato continuará a ser prorrogado a cada 30 (trinta) dias com prazo indeterminado caso as partes não se manifestem, acompanhado mensalmente da cobrança do ${monthlyValue}.`, style: 'p'},
    {text: `§ 2º. Caso a LOCATÁRIA deseje devolver o Objeto da Locação antes do término do Prazo Mínimo de Locação, a LOCATÁRIA deverá notificar a LOCADORA e também efetuar a quitação do Valor Total do Contrato (Cláusula Primeira, § 3º) por completo.`, style: 'p'}
  ]
}

