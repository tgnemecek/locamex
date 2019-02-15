import React from 'react';

import AccessoriesTable from './AccessoriesTable/index';
import ClientsTable from './ClientsTable/index';
import ContainersTable from './ContainersTable/index';
import ContractsTable from './ContractsTable/index';
import HistoryTable from './HistoryTable/index';
import SeriesTable from './SeriesTable/index';
import ModulesTable from './ModulesTable/index';
import PacksTable from './PacksTable/index';
import PlacesTable from './PlacesTable/index';
import ServicesTable from './ServicesTable/index';
import UsersTable from './UsersTable/index';

export default function DatabaseTable(props) {

  switch (props.type) {
    case 'accessories':
      return <AccessoriesTable {...props} />
      break;
    case 'models':
      return <ContainersTable {...props} />
      break;
    case 'clients':
      return <ClientsTable {...props} />
      break;
    case 'history':
      return <HistoryTable {...props} />
      break;
    case 'series':
      return <SeriesTable {...props} />
      break;
    case 'modules':
      return <ModulesTable {...props} />
      break;
    case 'packs':
      return <PacksTable {...props} />
      break;
    case 'places':
      return <PlacesTable {...props} />
      break;
    case 'services':
      return <ServicesTable {...props} />
      break;
    case 'users':
      return <UsersTable {...props} />
      break;
    case 'contracts':
      return <ContractsTable {...props} />
      break;
    default:
      return null;
  }
}