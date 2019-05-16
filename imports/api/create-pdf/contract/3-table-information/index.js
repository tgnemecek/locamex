import tools from '/imports/startup/tools/index';

export default function tableInformation(props) {
  return props.generateTable({
    body: props.client.type === "company" ? tableInformationCompany(props) : tableInformationPerson(props),
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
    styles: props.styles
  })
}

function tableInformationCompany(props) {
  const registryLabel = props.client.registryMU ? 'I. Municipal': 'I. Estadual';
  const showRegistry = () => {
    if (props.client.registryMU) {
      return props.client.registryMU;
    } else return props.client.registryES;
  }
  return [
      [ 'Razão Social', {text: props.client.officialName, colSpan: 5} ],
      [ 'CNPJ', {text: tools.format(props.client.registry, 'cnpj'), colSpan: 3}, registryLabel, showRegistry() ],
      [ 'Endereço', {text: props.client.address.street + ' ' + props.client.address.number, colSpan: 3}, 'CEP', tools.format(props.client.address.cep, 'cep') ],
      [ 'Cidade', {text: props.client.address.city, colSpan: 3}, 'UF', props.client.address.state ],
      [ 'Contato', props.negociator.name, 'Telefone', tools.format(props.negociator.phone1, 'phone'), 'Email', props.negociator.email ]
    ]
}

function tableInformationPerson(props) {
  function phone(client) {
    if (client.phone1) return tools.format(client.phone1, 'phone');
    if (client.phone2) return tools.format(client.phone2, 'phone');
  }
  return [
      [ 'Nome Completo', {text: props.client.description, colSpan: 5} ],
      [ 'CPF', {text: tools.format(props.client.registry, 'cpf'), colSpan: 3}, 'RG', props.client.rg ],
      [ 'Endereço', {text: props.client.address.street + ' ' + props.client.address.number, colSpan: 3}, 'CEP', tools.format(props.client.address.cep, 'cep') ],
      [ 'Cidade', {text: props.client.address.city, colSpan: 3}, 'UF', props.client.address.state ],
      [ 'Email', {text: props.client.email, colSpan: 3}, 'Telefone', phone(props.client) ]
    ]
}