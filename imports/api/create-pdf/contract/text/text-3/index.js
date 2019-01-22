export default function () {
  return [
    {text: `§ 3º. Define-se como Valor Total do Contrato a soma do Valor Total da Locação com o Valor Total do Pacote de Serviços.`, style: 'p'},
    {text: `§ 4º. Não está incluso em nenhuma forma neste contrato:`, style: 'p'},
    {ol: [
      `Emissão de ART (Anotação de Responsabilidade Técnica);`,
      `Pagamento de qualquer tipo de taxa junto à Prefeitura do Município;`,
      `Plano de Rigging;`,
      `Linha de Vida;`,
      `Aterramento dos módulos;`,
      `Qualquer outro serviço, insumo, material ou procedimento que não esteja expressamente descrito neste contrato.`
    ], style: 'ol', type: 'upper-roman'},
    {text: `CLÁUSULA SEGUNDA - DO PRAZO DA LOCAÇÃO`, style: 'h2'},
    {text: `O Objeto da Locação ficará sob responsabilidade da LOCATÁRIA durante o período seguinte:`, style: 'p'}
  ]
}

