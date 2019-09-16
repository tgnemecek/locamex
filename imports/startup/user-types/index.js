export const userTypes = {
  sales: {
    pages: ["clients", "series", "accessories", "packs", "proposals", "proposal"],
    events: []
  },
  finances: {
    pages: ["clients", "contracts", "contract", "billing", "accounts"],
    events: [
      "billingProducts",
      "billingServices"
    ]
  },
  maintenance: {
    pages: [
      "series", "series.edit",
      "accessories", "accessories.edit", "accessories.stock",
      "modules",
      "packs",
      "contracts",
      "shipping"
    ],
    events: ["deliveryDate"]
  }
}