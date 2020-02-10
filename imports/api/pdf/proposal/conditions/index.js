import tools from '/imports/startup/tools/index';

export default function conditions (props) {

  const unitLabel = () => {
    if (props.dates.duration > 1) {
      return props.dates.timeUnit === "months" ? 'meses' : 'dias';
    } else return props.dates.timeUnit === "months" ? 'mês' : 'dia';
  }

  const createList = () => {
    var list = [
      `Proposta de Locação de Módulos Habitáveis formulada para um mínimo de ${props.dates.duration} ${unitLabel()} de locação, ${props.dates.duration > 1 ? 'prorrogável' : 'prorrogáveis'}`,
      'Atenção: em caso de adiamento por parte do cliente da data de entrega, será considerada a data programada inicialmente para faturamento, visto que os itens ficam reservados para o cliente e indisponíveis para outras locações.',
      'Os prazos de entrega propostos baseiam-se na posição atual do estoque e podem variar sem aviso prévio.',
      'Validade da Proposta: 10 dias.'
    ]
    var conditions = props.observations.conditions;
    if (conditions) {
      conditions = conditions.trim().replace(/^• /g, '');
      conditions = conditions.split('\n• ');
      conditions.forEach((condition, i) => {
        list.splice(i+1, 0, condition);
      })
    }
    return list;
  }

  return [
    {text: 'Condições da Proposta', alignment: 'center', style: 'h2'},
    {ul: createList(), style: 'ul'}
  ]
}