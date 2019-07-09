import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableInformation(props) {

  function formatAddress(address) {

    function join(current, toAdd, char) {
      if (!toAdd) return current;
      if (toAdd.trim() === "") return current;
      if (current.length) return current + char + toAdd;
      return toAdd;
    }

    var string = "";

    if (address.street) string = join(string, address.city, "");
    if (address.number) string = join(string, address.number, ", ");
    if (address.city) string = join(string, address.city, " - ");
    if (address.state) string = join(string, address.state, " - ");
    if (address.additional) string = join(string, address.additional, " - ");
    if (address.cep) string += " (" + address.additional + ")";
    return {text: string, colSpan: 3};
  }



  return props.generateTable({
    body: [
        [ 'Cliente', props.client.description, 'Email', props.client.email || " " ],
        [ 'Contato', props.client.name, 'Telefone', tools.format(props.client.phone, 'phone') ],
        ['Local de Entrega', formatAddress(props.deliveryAddress)]
      ],
    widths: ['auto', '*', 'auto', 'auto'],
    styles: props.styles
  })
}