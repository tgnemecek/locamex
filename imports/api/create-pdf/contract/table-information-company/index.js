import tools from '/imports/startup/tools/index';

export default function tableInformationCompany(client, negociator, styles) {
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