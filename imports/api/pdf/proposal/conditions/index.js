import tools from '/imports/startup/tools/index';

export default function conditions (props) {

  const unitLabel = () => {
    if (props.dates.duration > 1) {
      return props.dates.timeUnit === "months" ? 'meses' : 'dias';
    } else return props.dates.timeUnit === "months" ? 'mês' : 'dia';
  }

  const conditionalLine1 = () => {
    if (props.dates.timeUnit === "months") {
      return 'Valores referentes à locação deverão ser pagos mensalmente, com primeiro pagamento em 15 dias da entrega.'
    } else {
      return 'O Valor Total do Orçamento deverá ser pago com sinal de 50% no fechamento da proposta e 50% de saldo em até 3 dias antes da entrega.'
    }
  }

  const conditionalLine2 = () => {
    if (props.dates.timeUnit === "months") {
      return 'Valores referentes ao Pacote de Serviços deverão ser pagos com sinal no ato e 50% de saldo em 30 dias.'
    } else return null;
  }

  return [
    {text: 'Condições da Proposta', alignment: 'center', style: 'h2'},
    {ul: [
      `Proposta de Locação de Módulos Habitáveis formulada para um mínimo de ${props.dates.duration} ${unitLabel()} de locação, ${props.dates.duration > 1 ? 'prorrogável' : 'prorrogáveis'}`,
      //props.observations.conditions,
      // conditionalLine1(),
      // conditionalLine2(),
      'Atenção: em caso de adiamento por parte do cliente da data de entrega, será considerada a data programada inicialmente para faturamento, visto que os itens ficam reservados para o cliente e indisponíveis para outras locações.',
      'Os prazos de entrega propostos baseiam-se na posição atual do estoque e podem variar sem aviso prévio.',
      'Validade da Proposta: 10 dias.'
    ], style: 'ul'}
  ]
}