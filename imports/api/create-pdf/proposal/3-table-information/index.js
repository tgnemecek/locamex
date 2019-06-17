import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableInformation(props) {
  return props.generateTable({
    body: [
        [ 'Cliente', props.client.description, 'Email', props.client.email ],
        [ 'Contato', props.client.name, 'Telefone', tools.format(props.client.phone, 'phone') ]
      ],
    widths: ['auto', '*', 'auto', 'auto'],
    styles: props.styles
  })
}