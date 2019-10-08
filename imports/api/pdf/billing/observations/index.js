export default function (props) {
  if (props.charge.observations) {
    return [
      {text: `Observação: ${props.charge.observations}`, style: 'p'}
    ]
  } else return null;
}