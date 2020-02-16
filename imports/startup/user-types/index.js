// Each userType has a write and read array of pages
// A 'write' permission is also a 'read' permission
// The 'events' array is temporary

export const userTypes = {
  administrator: {
    label: "Administrador",
    write: ['all'],
    read: ['all'],
    events: ['all']
  },
  general: {
    label: "Geral",
    write: [
      "clients",
      "series",
      "accessories",
      "packs",
      "proposals",
      "proposal",
      "contracts",
      "contract",
      "billing",
      "accounts",
      "shipping",
      "modules",
      "variations"
    ],
    read: [],
    events: [ // Temporary so it doesn't break!
      "billingProducts",
      "billingServices"
    ]
  },
  sales: {
    label: "Vendas",
    write: [
      "proposals",
      "proposal"
    ],
    read: [
      "places",
      "series",
      "accessories",
      "variations",
      "clients",
      "packs"
    ]
  },
  finances: {
    label: "Financeiro",
    write: [
      "clients",
      "contracts",
      "contract",
      "billing",
      "accounts"
    ],
    read: [],
    events: [ // Temporary so it doesn't break!
      "billingProducts",
      "billingServices"
    ]
  },
  maintenance: {
    label: "Manutenção",
    write: [
      "series",
      "accessories",
      "variations",
      "modules",
      "packs",
      "contracts",
      "shipping"
    ],
    read: [],
    events: ["deliveryDate"] // Temporary so it doesn't break!
  }
}