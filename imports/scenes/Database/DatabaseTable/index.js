import React from 'react';

import createExcel from '/imports/api/create-excel/index';

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

  generateReport = (array) => {
    createExcel(array, props.type);
  }

  switch (props.type) {
    case 'accessories':
      return <AccessoriesTable {...props} generateReport={this.generateReport} />
      break;
    case 'models':
      return <ContainersTable {...props} generateReport={this.generateReport} />
      break;
    case 'clients':
      return <ClientsTable {...props} generateReport={this.generateReport} />
      break;
    case 'history':
      return <HistoryTable {...props} generateReport={this.generateReport} />
      break;
    case 'series':
      return <SeriesTable {...props} generateReport={this.generateReport} />
      break;
    case 'modules':
      return <ModulesTable {...props} generateReport={this.generateReport} />
      break;
    case 'packs':
      return <PacksTable {...props} generateReport={this.generateReport} />
      break;
    case 'places':
      return <PlacesTable {...props} generateReport={this.generateReport} />
      break;
    case 'services':
      return <ServicesTable {...props} generateReport={this.generateReport} />
      break;
    case 'users':
      return <UsersTable {...props} generateReport={this.generateReport} />
      break;
    case 'contracts':
      return <ContractsTable {...props} generateReport={this.generateReport} />
      break;
    default:
      return null;
  }
}