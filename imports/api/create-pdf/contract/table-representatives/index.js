import tools from '/imports/startup/tools/index';

export default function tableRepresentatives(contract, styles) {
  if (contract.client.type === "person") return {};
  const renderBody = () => {
    return contract.representatives.map((rep) => {
      return [ 'Nome', rep.name, 'CPF', tools.format(rep.cpf, 'cpf'), 'RG', tools.format(rep.rg, 'rg') ]
    });
  }
  return [
    {text: `Representada neste ato por:`, style: 'p'},
    {table: {
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
      heights: styles.cellheight,
      body: renderBody(),
    }, style: 'table'}
  ]
}