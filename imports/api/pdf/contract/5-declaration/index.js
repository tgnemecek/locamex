export default function (props) {
  if (props.client.type === "company") return company(props);
  if (props.client.type === "person") return person(props);
}

function company(props) {
  return [
    {
      text: `declara estar investida dos poderes necessários para contratar em nome da LOCATÁRIA, assumindo inclusive a qualidade de fiel depositária do Objeto da Locação descrito abaixo, assim como a contratação dos serviços associados, e estabelecem entre si o presente Contrato de Locação de Bens Móveis e Prestação de Serviços oriundo da proposta aprovada de número ${
        props.proposalId
      }.${
        Number(props.proposalIndex) + 1
      } e regido pelas cláusulas e condições a seguir:`,
      style: "p",
    },
  ];
}

function person(props) {
  return [
    {
      text: `declara estar investida dos poderes necessários para contratar em seu nome, assumindo inclusive a qualidade de fiel depositária do Objeto da Locação descrito abaixo, assim como a contratação dos serviços associados, e estabelecem entre si o presente Contrato de Locação de Bens Móveis e Prestação de Serviços oriundo da proposta aprovada de número ${
        props.proposalId
      }.${
        Number(props.proposalIndex) + 1
      } e regido pelas cláusulas e condições a seguir:`,
      style: "p",
    },
  ];
}
