export default function (observations) {
  if (observations) {
    return [
      {text: `Observação: ${observations}`, style: 'p'}
    ]
  } else return null;
}