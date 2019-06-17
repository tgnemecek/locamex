import moment from 'moment';

export default function signature (data) {
  return {text: [
          `${moment().format("DD/MM/YYYY")}\n`,
          'Atenciosamente,\n',
          'Jurgen Junior\n',
          'Fone: (11) 5532-0790 / (11) 55335614'
      ], alignment: 'right', style: 'p'}
}