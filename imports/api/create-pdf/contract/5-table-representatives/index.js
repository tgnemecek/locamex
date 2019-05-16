import tools from '/imports/startup/tools/index';

export default function tableRepresentatives(props) {
  if (props.client.type === "person") return {};
  const renderBody = () => {
    return props.representatives.map((rep) => {
      return [ 'Nome', rep.name, 'CPF', tools.format(rep.cpf, 'cpf'), 'RG', tools.format(rep.rg, 'rg') ]
    });
  }
  return [
    {text: `Representada neste ato por:`, style: 'p'},
    {table: {
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
      heights: props.styles.cellheight,
      body: renderBody(),
    }, style: 'table'}
  ]
}