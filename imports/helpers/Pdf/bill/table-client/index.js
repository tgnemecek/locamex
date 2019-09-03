import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableClient(props) {

  function formatAddress(address) {

    function join(current, toAdd, char) {
      if (!toAdd) return current;
      if (toAdd.toString().trim() === "") return current;
      if (current.length) return current + char + toAdd;
      return toAdd;
    }

    var string = "";

    if (address.street) string = join(string, address.street, "");
    if (address.number) string = join(string, address.number, ", ");
    if (address.city) string = join(string, address.city, " - ");
    if (address.state) string = join(string, address.state, " - ");
    if (address.additional) string = join(string, address.additional, " - ");
    return {text: string, colSpan: "fill"};
  }

  const contacts = () => {
    var phone = props.client.phone1 || props.client.phone2;
    if (props.client.type === "person") {
      return [
        'Contato', props.client.description, 'Telefone', tools.format(phone, 'phone'), 'Email', props.client.email
      ]
    } else {
      return props.client.contacts.map((contact) => {
        return [
          'Contato', contact.name, 'Telefone', tools.format(props.client.phone, 'phone'), 'Email', contact.email
        ]
      })
    }
  }

  var name = props.client.officialName;
  var registryLabel = "CNPJ";
  var contact = props.client.name;

  if (props.client.type === "person") {
    name = props.client.description;
    registryLabel = "CPF";
    contact = props.client.description;
  }

  return props.generateTable({
    body: [
        [ 'Nome do Sacado', {text: name, colSpan: "fill"} ],
        [ registryLabel, tools.format(props.client.registry, registryLabel), 'Endereço', formatAddress(props.client.address) ],
        contacts()
      ],
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto']
  })
}