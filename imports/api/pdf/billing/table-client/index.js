import tools from "/imports/startup/tools/index";

export default function tableClient(client, generateTable) {
  function formatAddress(address) {
    function join(current, toAdd, char) {
      if (!toAdd) return current;
      if (toAdd.toString().trim() === "") return current;
      if (current.length) return current + char + toAdd;
      return toAdd;
    }

    var string = "";

    if (address.street) string = join(string, address.street, "");
    if (address.number) string = join(string, address.number, ", ");
    if (address.city) string = join(string, address.city, " - ");
    if (address.state) string = join(string, address.state, " - ");
    if (address.additional) string = join(string, address.additional, " - ");
    return { text: string, colSpan: "fill" };
  }

  const contacts = () => {
    var phone = client.phone1 || client.phone2;
    if (client.type === "person") {
      return [
        "Contato",
        client.description,
        "Telefone",
        tools.format(phone, "phone"),
        "Email",
        client.email,
      ];
    } else {
      return client.contacts.map((contact) => {
        var phone = contact.phone1 || contact.phone2;
        var arr = ["Contato", contact.name];
        if (phone) arr.push("Telefone", tools.format(phone, "phone"));
        if (contact.email) arr.push("Email", contact.email);
        return arr;
      });
    }
  };

  var name = client.officialName;
  var registryLabel = "CNPJ";

  if (client.type === "person") {
    name = client.description;
    registryLabel = "CPF";
  }

  return generateTable({
    body: [
      ["Nome do Sacado", { text: name, colSpan: "fill" }],
      [registryLabel, tools.format(client.registry, registryLabel)],
      [
        "Endereço",
        formatAddress(client.address),
        "CEP",
        tools.format(client.address.cep, "cep"),
      ],
      contacts(),
    ],
    widths: ["auto", "*", "auto", "auto", "auto", "auto"],
  });
}
