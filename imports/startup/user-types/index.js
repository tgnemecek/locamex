// Each userType has a write and read array of pages
// A 'write' permission is also a 'read' permission
// The 'events' array is temporary

export const userTypes = {
  administrator: {
    label: "Administrador",
    write: ["all"],
    read: ["all"],
    events: ["all"],
  },
  general: {
    label: "Geral",
    write: [
      "clients",
      "client",
      "series",
      "accessories",
      "accessory",
      "packs",
      "pack",
      "proposals",
      "proposal",
      "contracts",
      "contract",
      "billing",
      "accounts",
      "account",
      "shipping",
      "modules",
      "module",
      "variations",
      "variation",
    ],
    read: [],
    events: [
      // Temporary so it doesn't break!
      "billingProducts",
      "billingServices",
    ],
  },
  sales: {
    label: "Vendas",
    write: [
      "clients",
      "client",
      "proposals",
      "proposal",
      "series.place",
      "shipping",
      "packs",
      "pack",
    ],
    read: [
      "places",
      "place",
      "series",
      "containers",
      "services",
      "accessories",
      "accessory",
      "variations",
      "variation",
      "clients",
      "client",
      "contracts",
    ],
  },
  finances: {
    label: "Financeiro",
    write: [
      "clients",
      "client",
      "contracts",
      "contract",
      "contract",
      "billing",
      "accounts",
      "account",
    ],
    read: [],
    events: [
      // Temporary so it doesn't break!
      "billingProducts",
      "billingServices",
    ],
  },
  maintenance: {
    label: "Manutenção",
    write: [
      "series",
      "accessories",
      "accessory",
      "variations",
      "variation",
      "modules",
      "module",
      "packs",
      "pack",
      "contracts",
      "contract",
      "shipping",
    ],
    read: [],
    events: ["deliveryDate"], // Temporary so it doesn't break!
  },
};
