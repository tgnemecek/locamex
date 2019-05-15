import tools from '/imports/startup/tools/index';

export default function tableInformation(client, negociator, styles) {
  if (client.type === "company") return tableInformationCompany(client, negociator, styles);
  if (client.type === "person") return tableInformationPerson(client, negociator, styles);
}

function tableInformationCompany(client, negociator, styles) {
  const registryLabel = client.registryMU ? 'I. Municipal': 'I. Estadual';
  const showRegistry = () => {
    if (client.registryMU) {
      return client.registryMU;
    } else return client.registryES;
  }
  return {table: {
    headerRows: 0,
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
    heights: styles.cellheight,
    body: [
        [ 'Razão Social', {text: client.officialName, colSpan: 5}, '', '', '', '' ],
        [ 'CNPJ', {text: tools.format(client.registry, 'cnpj'), colSpan: 3}, '', '', registryLabel, showRegistry() ],
        [ 'Endereço', {text: client.address.street + ' ' + client.address.number, colSpan: 3}, '', '', 'CEP', tools.format(client.address.cep, 'cep') ],
        [ 'Cidade', {text: client.address.city, colSpan: 3}, '', '', 'UF', client.address.state ],
        [ 'Contato', negociator.name, 'Telefone', tools.format(negociator.phone1, 'phone'), 'Email', negociator.email ]
      ]
  }, style: 'table'};
}

function tableInformationPerson(client, negociator, styles) {
  function phone(client) {
    if (client.phone1) return tools.format(client.phone1, 'phone');
    if (client.phone2) return tools.format(client.phone2, 'phone');
  }
  return {table: {
    headerRows: 0,
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
    heights: styles.cellheight,
    body: [
        [ 'Nome Completo', {text: client.description, colSpan: 5}, '', '', '', '' ],
        [ 'CPF', {text: tools.format(client.registry, 'cpf'), colSpan: 3}, '', '', 'RG', client.rg ],
        [ 'Endereço', {text: client.address.street + ' ' + client.address.number, colSpan: 3}, '', '', 'CEP', tools.format(client.address.cep, 'cep') ],
        [ 'Cidade', {text: client.address.city, colSpan: 3}, '', '', 'UF', client.address.state ],
        [ 'Email', {text: client.email, colSpan: 3}, '', '', 'Telefone', phone(client) ]
      ]
  }, style: 'table'};
}