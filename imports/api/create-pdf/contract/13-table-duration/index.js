import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableDuration(props) {
  const calcEndDate = () => {
    return {text: moment(props.dates.startDate).add(props.dates.duration, 'M').format("DD-MMMM-YYYY"), alignment: 'center'};
  }
  const monthPlural = () => {
    if (props.dates.duration > 1) {
      return ' meses';
    } else return ' mês';
  }
  return {table: {
    widths: ['auto', '*', 'auto', '*', 'auto', 'auto'],
    heights: props.styles.cellheight,
    body: [ [
      'Início em',
      {text: moment(props.dates.startDate).format("DD-MMMM-YYYY"), alignment: 'center'},
      'Término em',
      calcEndDate(),
      'Prazo mínimo de Locação',
      {text: props.dates.duration + monthPlural(), alignment: 'center'}
    ] ]
  }, style: 'table'}
}