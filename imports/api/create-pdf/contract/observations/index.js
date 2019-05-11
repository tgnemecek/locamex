export default function observations(externalObservations) {
  if (externalObservations) {
    return {text: `OBS: ${externalObservations}`, style: 'p'}
  } else return null;
}