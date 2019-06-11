import tools from '/imports/startup/tools/index';

export default function tableRepresentatives(props) {
  if (props.client.type === "person") return {};
  const renderBody = () => {
    return props.representatives.map((rep) => {
      return [ 'Nome', rep.name, 'CPF', tools.format(rep.cpf, 'cpf'), 'RG', rep.rg ]
    });
  }
  return props.generateTable({
    body: renderBody(),
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
    styles: props.styles
  })
}