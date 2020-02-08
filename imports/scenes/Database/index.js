import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

// import StockVisualizer from '/imports/components/StockVisualizer/index';
// import ImageVisualizer from '/imports/components/ImageVisualizer/index';
// import RegisterData from '/imports/components/RegisterData/index';
//
// import DatabaseTable from './DatabaseTable/index';
import createExcel from '/imports/api/create-excel/index';

import AccessoriesTable from './AccessoriesTable/index';
import AccountsTable from './AccountsTable/index';
import ClientsTable from './ClientsTable/index';
import ContainersTable from './ContainersTable/index';
import ContractsTable from './ContractsTable/index';
import HistoryTable from './HistoryTable/index';
import SeriesTable from './SeriesTable/index';
import ModulesTable from './ModulesTable/index';
import PacksTable from './PacksTable/index';
import PlacesTable from './PlacesTable/index';
import ProposalsTable from './ProposalsTable/index';
import ServicesTable from './ServicesTable/index';
import UsersTable from './UsersTable/index';

export default function Database (props) {
  var Component;
  switch (props.match.params.database) {
    case 'accessories':
      Component = AccessoriesTable;
      break;
    case 'accounts':
      Component = AccountsTable;
      break;
    case 'models':
      Component = ContainersTable;
      break;
    case 'clients':
      Component = ClientsTable;
      break;
    case 'history':
      Component = HistoryTable;
      break;
    case 'series':
      Component = SeriesTable;
      break;
    case 'modules':
      Component = ModulesTable;
      break;
    case 'packs':
      Component = PacksTable;
      break;
    case 'places':
      Component = PlacesTable;
      break;
    case 'services':
      Component = ServicesTable;
      break;
    case 'users':
      Component = UsersTable;
      break;
    case 'contracts':
      Component = ContractsTable;
      break;
    case 'proposals':
      Component = ProposalsTable;
      break;
    default:
      return null;
  }
  // constructor(props) {
  //   super(props);
  //   state = {
  //     item: null,
  //     editWindow: false,
  //     stockVisualizer: false,
  //     imageWindow: false
  //   }
  // }
  //
  // toggleEditWindow = (item) => {
  //   if (typeof item === "object") {
  //     setState({
  //       editWindow: !state.editWindow,
  //       item
  //     });
  //   } else setState({ editWindow: false, item: null });
  // }
  //
  // toggleStockVisualizer = (item) => {
  //   if (item) {
  //     setState({
  //       stockVisualizer: !state.stockVisualizer,
  //       item
  //     });
  //   } else setState({ stockVisualizer: false, item: null });
  // }
  //
  // toggleImageWindow = (item) => {
  //   if (item) {
  //     setState({
  //       imageWindow: !state.imageWindow,
  //       item
  //     });
  //   } else setState({ imageWindow: false, item: null });
  // }

  return (
    <div className="page-content">
      <div className="database">
        <Component generateReport={createExcel}/>
      </div>
      {/* {state.stockVisualizer ?
        <StockVisualizer
          type={state.item.type}
          item={state.item}
          toggleWindow={toggleStockVisualizer}
        />
      : null}
      {state.imageWindow ?
        <ImageVisualizer
          item={{...state.item, itemType: props.match.params.database}}
          toggleWindow={toggleImageWindow}
        />
      : null}
      {state.editWindow ?
        <RegisterData
          type={props.match.params.database}
          item={state.item}
          toggleWindow={toggleEditWindow}
        />
      : null} */}
    </div>
  )
}