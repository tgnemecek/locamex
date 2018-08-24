export default function checkCep(arg, callback) {
  fetch(`https://viacep.com.br/ws/${arg}/json/`)
  .then(response => response.json() )
  .then( data => {
    callback(data);
  })
  .catch(err => {
    callback('', err);
  })
}