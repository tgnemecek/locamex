export default function observations(props) {
  if (props.observations.external) {
    return {text: `OBS: ${props.observations.external}`, style: 'p'}
  } else return null;
}