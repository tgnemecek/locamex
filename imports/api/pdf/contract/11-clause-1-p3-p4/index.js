import tools from '/imports/startup/tools/index';

export default function (props) {
  return [
    {text: `§ 3º. Define-se como Valor Total do Contrato a importância de ${tools.format(props.totalValueContract, 'currency')}, composto pela soma do Valor Total da Locação com o Valor Total do Pacote de Serviços.`, style: 'p'},
    {text: `§ 4º. A menos que estritamente especificados, não estão inclusos neste contrato:`, style: 'p'},
    {ol: [
      `Emissão de ART (Anotação de Responsabilidade Técnica);`,
      `Pagamento de qualquer tipo de taxa junto à Prefeitura do Município;`,
      `Plano de Rigging;`,
      `Linha de Vida;`,
      `Aterramento dos módulos;`,
      `Qualquer outro serviço, insumo, material ou procedimento que não esteja expressamente descrito neste contrato.`
    ], style: 'ol', type: 'upper-roman'}
  ]
}

