import tools from '/imports/startup/tools/index';

export default function tableRepresentatives(props) {
  const renderBody = () => {
    if (props.client.type === "person") {
      return [ 'Nome', props.client.description, 'CPF', tools.format(props.client.registry, 'cpf'), 'RG', props.client.rg ]
    } else return props.representatives.map((rep) => {
      return [ 'Nome', rep.name, 'CPF', tools.format(rep.cpf, 'cpf'), 'RG', rep.rg ]
    });
  }
  var title = {text: `Representada neste ato por:`, style: 'p'}
  var table = props.generateTable({
    body: renderBody(),
    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
    styles: props.styles
  })

  if (props.client.type === "company") {
    return [title, table];
  } else return [];
}