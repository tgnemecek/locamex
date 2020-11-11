import React from "react";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";
import { History } from "/imports/api/history/index";
import RedirectUser from "/imports/components/RedirectUser/index";
import tools from "/imports/startup/tools/index";
import Icon from "/imports/components/Icon/index";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";
import ShowMore from "/imports/components/ShowMore/index";

class HistoryTable extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="history" />
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th>Versão</th>
                <th>Usuário</th>
                <th className="table__wide">Tipo de Documento</th>
                <th>ID</th>
                <th>Operação</th>
              </tr>
            </thead>
            <tbody>
              {this.props.database.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{moment(item.date).format("DD-MM-YYYY")}</td>
                    <td>{moment(item.date).format("HH:mm:ss")}</td>
                    <td>{item.version}</td>
                    <td>
                      {item.user.profile.firstName +
                        " " +
                        item.user.profile.lastName}
                    </td>
                    <td className="table__wide">{item.doc.type}</td>
                    <td>{item.doc._id}</td>
                    <td>{item.hook}</td>
                    <td>
                      <button onClick={() => console.log(item)}>
                        <Icon icon="print" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ShowMore
          showMore={this.props.showMore}
          numberOfRecords={this.props.recordsToShow}
        />
      </ErrorBoundary>
    );
  }
}

export default HistoryTableWrapper = withTracker((props) => {
  var recordsToShow = 50;
  Meteor.subscribe("historyPub", recordsToShow);
  var database = History.find().fetch() || [];
  const showMore = () => {
    Meteor.subscribe("historyPub", 0);
  };
  return {
    database,
    recordsToShow,
    showMore,
  };
})(HistoryTable);
