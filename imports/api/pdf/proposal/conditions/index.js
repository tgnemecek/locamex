import tools from '/imports/startup/tools/index';

export default function conditions (props) {

  const unitLabel = () => {
    if (props.dates.duration > 1) {
      return props.dates.timeUnit === "months" ? 'meses' : 'dias';
    } else return props.dates.timeUnit === "months" ? 'mês' : 'dia';
  }

  function conditionsToArray(conditions) {
    if (conditions) {
      conditions = conditions.trim().replace(/^• /g, '');
      return conditions.split('\n• ');
    } else return '';
  }

  return [
    {text: 'Condições da Proposta', alignment: 'center', style: 'h2'},
    {ul: [
      `Proposta de Locação de Módulos Habitáveis formulada para um mínimo de ${props.dates.duration} ${unitLabel()} de locação, ${props.dates.duration > 1 ? 'prorrogável' : 'prorrogáveis'}`,
      conditionsToArray(props.observations.conditions),
      'Atenção: em caso de adiamento por parte do cliente da data de entrega, será considerada a data programada inicialmente para faturamento, visto que os itens ficam reservados para o cliente e indisponíveis para outras locações.',
      'Os prazos de entrega propostos baseiam-se na posição atual do estoque e podem variar sem aviso prévio.',
      'Validade da Proposta: 10 dias.'
    ], style: 'ul'}
  ]
}