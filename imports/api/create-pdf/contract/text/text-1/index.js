export default function (contract) {
  if (contract.client.type === "company") return company(contract);
  if (contract.client.type === "person") return person(contract);
}

function company(contract) {
  return [
    {text: `que declara estar investida dos poderes necessários para contratar em nome da LOCATÁRIA, assumindo inclusive a qualidade de fiel depositária do Objeto da Locação descrito abaixo, assim como a contratação dos serviços associados, e estabelecem entre si o presente Contrato de Locação de Bens Móveis e Prestação de Serviços oriundo da proposta aprovada de número ${contract.proposal} e regido pelas cláusulas e condições a seguir:`, style: 'p'},
    {text: `CLÁUSULA PRIMEIRA - DO OBJETO DO CONTRATO`, style: 'h2'},
    {text: `Por meio deste contrato, que firmam entre si a LOCADORA e a LOCATÁRIA, regula-se a locação dos seguintes bens assim como a prestação de serviços associados.`, style: 'p'},
    {text: `§ 1º. Define-se como Objeto da Locação os seguintes itens, assim como o Valor Mensal de Locação e o Valor Total da Locação:`, style: 'p'}
  ]
}

function person(contract) {
  return [
    {text: `que declara estar investida dos poderes necessários para contratar em seu nome, assumindo inclusive a qualidade de fiel depositária do Objeto da Locação descrito abaixo, assim como a contratação dos serviços associados, e estabelecem entre si o presente Contrato de Locação de Bens Móveis e Prestação de Serviços oriundo da proposta aprovada de número ${contract.proposal} e regido pelas cláusulas e condições a seguir:`, style: 'p'},
    {text: `CLÁUSULA PRIMEIRA - DO OBJETO DO CONTRATO`, style: 'h2'},
    {text: `Por meio deste contrato, que firmam entre si a LOCADORA e a LOCATÁRIA, regula-se a locação dos seguintes bens assim como a prestação de serviços associados.`, style: 'p'},
    {text: `§ 1º. Define-se como Objeto da Locação os seguintes itens, assim como o Valor Mensal de Locação e o Valor Total da Locação:`, style: 'p'}
  ]
}