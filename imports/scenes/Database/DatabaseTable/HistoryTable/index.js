import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { History } from '/imports/api/history/index';
import moment from 'moment';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class HistoryTable extends React.Component {

  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Dia</th>
        <th>Horário</th>
        <th>Versão</th>
        <th>Usuário</th>
        <th>Banco de Dados</th>
        <th>Item</th>
        <th className="table__small-column"></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.props.fullDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      console.log(item.data._id);
      return (
        <tr key={i}>
          <td>{moment(item.insertionDate).format("DD-MM-YYYY")}</td>
          <td>{moment(item.insertionDate).format("HH:mm:ss")}</td>
          <td>{item.version}</td>
          <td>{item.user.firstName}</td>
          <td>{item.type}</td>
          <td>{item.data._id ? item.data._id.toString() : "-"}</td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="history"/>
          <div className="database__scroll-div">
            <table className="table database__table">
              <thead>
                {this.renderHeader()}
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
        </ErrorBoundary>
      )
    } else if (!this.props.ready) {
      return (
        <div className="database__scroll-div">
          <table className="table database__table">
            <thead>
              {this.renderHeader()}
            </thead>
          </table>
        </div>
      )
    }
  }
}

export default HistoryTableWrapper = withTracker((props) => {
  Meteor.subscribe('historyPub');
  var fullDatabase = History.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(HistoryTable);