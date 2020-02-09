import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { History } from '/imports/api/history/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import ShowMore from '/imports/components/ShowMore/index';

class HistoryTable extends React.Component {
  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="history"/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th>Versão</th>
                <th>Usuário</th>
                <th className="table__wide">Banco de Dados</th>
                <th>Item</th>
              </tr>
            </thead>
            <tbody>
              {this.props.database.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{moment(item.insertionDate).format("DD-MM-YYYY")}</td>
                    <td>{moment(item.insertionDate).format("HH:mm:ss")}</td>
                    <td>{item.version}</td>
                    <td>{item.user.firstName}</td>
                    <td className="table__wide">{item.type}</td>
                    <td>{item.data._id ? item.data._id.toString() : "-"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <ShowMore
          showMore={this.props.showMore}
          numberOfRecords={this.props.recordsToShow}
        />
      </ErrorBoundary>
    )
  }
}

export default HistoryTableWrapper = withTracker((props) => {
  var recordsToShow = 50;
  Meteor.subscribe('historyPub', recordsToShow);
  var database = History.find().fetch() || [];
  const showMore = () => {
    Meteor.subscribe('historyPub', 0);
  }
  return {
    database,
    recordsToShow,
    showMore
  }
})(HistoryTable);