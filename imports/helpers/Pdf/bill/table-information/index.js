import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableInformation(props) {

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
    return {text: string, colSpan: 3};
  }

  var proposal = props.proposal + "." + (Number(props.proposalVersion)+1);

  var registryLabel = props.client.type === "company" ? "CNPJ" : "CPF";
debugger; // CONTINUE HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  return props.generateTable({
    body: [
        [ 'Contrato', (props._id + "." + (props.activeVersion)), 'Proposta', proposal ],
        [ 'Cliente', props.client.description, 'Email', props.client.email || " " ],
        [ registryLabel, tools.format(props.client.registry, registryLabel), 'Endereço de Cobrança', formatAddress(props.client.address) ],
        [ 'Contato', props.client.name, 'Telefone', tools.format(props.client.phone, 'phone') ],
      ],
    widths: ['auto', '*', 'auto', 'auto'],
    styles: props.styles
  })
}