export default function introduction(props){

  const unitLabel = () => {
    if (props.dates.duration > 1) {
      return props.dates.timeUnit === "months" ? 'meses' : 'dias';
    } else return props.dates.timeUnit === "months" ? 'mês' : 'dia';
  }

  return {text: [
    `Proposta de Locação de Módulos Habitáveis formulada para um mínimo de ${props.dates.duration} ${unitLabel()} de locação, ${props.dates.duration > 1 ? 'prorrogável' : 'prorrogáveis'}. Esta proposta tem validade máxima de 10 dias e pode variar de acordo com o estoque.`
  ], style: 'p'}
}