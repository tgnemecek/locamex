import tools from "/imports/startup/tools/index";
import moment from "moment";

import title from "./title/index";
import tableInformation from "./table-information/index";
import tableClient from "./table-client/index";
import conditions from "./conditions/index";
import tableProducts from "./table-products/index";
import tableAddress from "./table-address/index";
import tableBill from "./table-bill/index";
import notService from "./not-service/index";
import observations from "./observations/index";

export default function billingPdf({
  contract,
  snapshot,
  bill,
  header,
  generateTable,
  styles,
}) {
  // const contract = props.master;
  // const generateTable = props.generateTable;
  // const styles = props.styles;
  // const bill = props.bill;

  const products = snapshot.containers
    .concat(snapshot.accessories)
    .map((item) => {
      item.monthlyPrice = item.quantity * item.price;
      return item;
    });
  const totalValueProducts = products.length
    ? products.reduce((acc, current) => {
        return acc + current.monthlyPrice;
      }, 0) *
      (1 - snapshot.discount)
    : 0;

  function resultFormat(input) {
    return {
      text: tools.format(input, "currency"),
      alignment: "right",
      bold: true,
    };
  }

  var activeVersion =
    contract.snapshots.findIndex((snapshot) => {
      return snapshot.active;
    }) + 1;

  return {
    fileName: `Locamex - Contrato #${contract._id}_${activeVersion} - Fatura ${
      bill.index + 1
    } de ${bill.length}.pdf`,
    pageSize: "A4",
    pageMargins: [40, 110, 40, 45], //[left, top, right, bottom]
    info: {
      title: `Fatura ${bill.index + 1} de ${bill.length} - Locamex #${
        contract._id
      }.${activeVersion}`,
      author: `Locamex`,
      subject: `Fatura de Locação de Bens Móveis`,
    },
    header: header([
      "LOCAMEX LOCAÇÕES E OBRAS EIRELI - EPP\n",
      "CNPJ 05.411.043/0001-83\n",
      "Inscrição Estadual 148.701.950.113\n",
      {
        text: "adm@locamex.com.br\n",
        link: "mailto:adm@locamex.com.br",
      },
      {
        text: "financeiro@locamex.com.br",
        link: "mailto:financeiro@locamex.com.br",
      },
    ]),
    content: [
      title(bill.type, bill.index, bill.length),
      tableInformation(
        contract.proposalId,
        contract.proposalIndex,
        generateTable,
        contract._id,
        activeVersion
      ),
      tableClient(snapshot.client, generateTable),
      conditions(bill.expiryDate, bill.value),
      tableProducts(
        snapshot.dates,
        products,
        snapshot.discount,
        resultFormat,
        bill.value,
        generateTable
      ),
      tableAddress(snapshot.deliveryAddress, generateTable),
      tableBill(bill, contract._id, activeVersion, generateTable),
      notService(),
      observations(bill.observations),
    ],
    footerStatic: `Locamex - Contrato #${
      contract._id
    }.${activeVersion} - Fatura ${bill.index + 1} de ${bill.length}\n`,
    styles,
  };
}
