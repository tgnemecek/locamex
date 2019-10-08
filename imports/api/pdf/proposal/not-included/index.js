export default function notIncluded () {
  return [
    {text: 'A menos que explicitados acima, os seguintes itens não estão inclusos neste orçamento:', style: 'p'},
    {ul: [
      `Nivelamento de terreno.`,
      `Plano de Rigging (içamento de carga).`,
      `Taxas junto à feira de exposições, crachás, estacionamento.`,
      `Transportes horizontais dentro da área do cliente.`,
      `Integração (horas paradas para treinamento no site do cliente).`,
      `Cabo de segurança ou plataforma elevatória de segurança (PTA).`,
      `Aterramento obrigatório dos Módulos / Containers NBR 5410.`,
      `Anotação de Responsabilidade Técnica (ART) / Registro de Responsabilidade Técnica (RRT)`
    ], style: 'ul'}
  ]
}