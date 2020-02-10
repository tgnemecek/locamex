import tools from '/imports/startup/tools/index';

export default function description (props) {
  if (!props.observations.external) return null;

  return [
    {text: 'Descrição da Proposta', alignment: 'center', style: 'h2'},
    {text: props.observations.external, style: 'p'}
  ]
}