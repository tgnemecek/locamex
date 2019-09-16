export const appStructure = [
  {
    groupName: "dashboard",
    groupTitle: "Início",
    pages: [
      {
        name: "dashboard",
        title: "Início",
        link: "/dashboard",
        visible: true
      },
      {
        name: "test",
        title: "Teste",
        link: "/test",
        visible: false
      }
    ]
  },
  {
    groupName: "administrative",
    groupTitle: "Administrativo",
    pages: [
      {
        name: "users",
        title: "Usuários",
        link: "/database/users",
        visible: true
      },
      {
        name: "services",
        title: "Serviços",
        link: "/database/services",
        visible: true
      },
      {
        name: "places",
        title: "Pátios",
        link: "/database/places",
        visible: true
      },
      {
        name: "accounts",
        title: "Contas",
        link: "/database/accounts",
        visible: true
      },
      {
        name: "history",
        title: "Histórico",
        link: "/database/history",
        visible: true
      }
    ]
  },
  {
    groupName: "clients",
    groupTitle: "Clientes",
    pages: [
      {
        name: "clients",
        title: "Clientes",
        link: "/database/clients",
        visible: true
      }
    ]
  },
  {
    groupName: "products",
    groupTitle: "Produtos",
    pages: [
      {
        name: "models",
        title: "Modelos",
        link: "/database/models",
        visible: true
      },
      {
        name: "series",
        title: "Séries",
        link: "/database/series",
        visible: true
      },
      {
        name: "accessories",
        title: "Acessórios",
        link: "/database/accessories",
        visible: true
      },
      {
        name: "modules",
        title: "Componentes",
        link: "/database/modules",
        visible: true
      },
      {
        name: "packs",
        title: "Montados",
        link: "/database/packs",
        visible: true
      }
    ]
  },
  {
    groupName: "proposals",
    groupTitle: "Propostas",
    pages: [
      {
        name: "proposals",
        title: "Propostas",
        link: "/database/proposals",
        visible: true
      },
      {
        name: "proposal",
        title: "Proposta",
        link: "/proposal/",
        visible: false
      }
    ]
  },
  {
    groupName: "contracts",
    groupTitle: "Contratos",
    pages: [
      {
        name: "contracts",
        title: "Contratos",
        link: "/database/contracts",
        visible: true
      },
      {
        name: "contract",
        title: "Contrato",
        link: "/contract/",
        visible: false
      },
      {
        name: "billing",
        title: "Faturamento",
        link: "/billing/",
        visible: false
      },
      {
        name: "shipping",
        title: "Remessa",
        link: "/shipping/",
        visible: false
      }
    ]
  }
]