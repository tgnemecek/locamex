import moment from 'moment';

export default function date() {
  var date = new Date();
  return {text: `São Paulo, ${date.getDate()} de ${moment(date).format('MMMM')} de ${date.getFullYear()}`, style: 'p', margin: [0, 10, 0, 50]}
}