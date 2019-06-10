import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableDuration(props) {
  const calcEndDate = () => {
    return {text: moment(props.dates.startDate).add(props.dates.duration, 'M').format("DD-MMMM-YYYY"), alignment: 'center'};
  }
  const monthPlural = () => {
    if (props.dates.duration > 1) {
      return props.dates.timeUnit === "months" ? ' meses' : ' dias';
    } else return props.dates.timeUnit === "months" ? ' mês' : ' dia';
  }

  return props.generateTable({
    body: [
      'Início em',
      {text: moment(props.dates.startDate).format("DD-MMMM-YYYY"), alignment: 'center'},
      'Término em',
      calcEndDate(),
      'Prazo mínimo de Locação',
      {text: props.dates.duration + monthPlural(), alignment: 'center'}
    ],
    widths: ['auto', '*', 'auto', '*', 'auto', 'auto'],
    styles: props.styles
  })
}