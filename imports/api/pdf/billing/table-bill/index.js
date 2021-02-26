import moment from "moment";
import tools from "/imports/startup/tools/index";

export default function tableBill(
  bill,
  contractId,
  activeVersion,
  generateTable
) {
  var start = moment(bill.startDate).format("DD/MM/YYYY");
  var end = moment(bill.endDate).format("DD/MM/YYYY");
  var expiry = moment(bill.expiryDate).format("DD/MM/YYYY");
  var period = start + " a " + end;

  var contractNumber = contractId + "." + activeVersion;

  return generateTable({
    body: [
      [
        "Valor Total da Fatura",
        {
          text: `${tools.format(bill.value, "currency")} (${tools.format(
            bill.value,
            "extenso",
            {
              mode: "currency",
            }
          )})`,
          bold: true,
        },
      ],
      ["Vencimento", { text: expiry, bold: true }],
      [
        "Período de Locação",
        { text: period, bold: true },
        "Número da Fatura",
        { text: bill._id, bold: true },
      ],
    ],
    widths: ["*", "*", "*", "*"],
  });
}
