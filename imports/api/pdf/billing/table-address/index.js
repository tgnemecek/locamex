import tools from '/imports/startup/tools/index';

export default function tableAddress(props) {

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
    if (address.cep) string += " (" + tools.format(address.cep, 'cep') + ")";
    return {text: string};
  }


  var additional = props.deliveryAddress.additional ? ` (${props.deliveryAddress.additional})` : '';

  return [
    {text: 'Local de Instalação:', style: 'p'},
    props.generateTable({
      body: [[ formatAddress(props.deliveryAddress) ]],
      widths: ['*'],
      styles: props.styles
    })
  ]
}