import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableDuration(dates, styles) {
  const calcEndDate = () => {
    return {text: moment(dates.startDate).add(dates.duration, 'M').format("DD-MMMM-YYYY"), alignment: 'center'};
  }
  const monthPlural = () => {
    if (dates.duration > 1) {
      return ' meses';
    } else return ' mês';
  }
  return {table: {
    widths: ['auto', '*', 'auto', '*', 'auto', 'auto'],
    heights: styles.cellheight,
    body: [ [
      'Início em',
      {text: moment(dates.startDate).format("DD-MMMM-YYYY"), alignment: 'center'},
      'Término em',
      calcEndDate(),
      'Prazo mínimo de Locação',
      {text: dates.duration + monthPlural(), alignment: 'center'}
    ] ]
  }, style: 'table'}
}