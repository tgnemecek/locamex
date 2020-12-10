import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import RedirectUser from "/imports/components/RedirectUser/index";
import { Proposals } from "/imports/api/proposals/index";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";
import FilterBar from "/imports/components/FilterBar/index";
import tools from "/imports/startup/tools/index";
import Icon from "/imports/components/Icon/index";

import Status from "/imports/components/Status/index";
import ShowMore from "/imports/components/ShowMore/index";

class ProposalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: "",
    };
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  };

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        if (!item) return false;
        return tools.findSubstring(this.state.filterTerm, [
          item._id,
          item.clientDescription,
        ]);
      })
      .map(({ _id, clientDescription, status, totalValue }, i) => {
        return (
          <tr key={_id}>
            <td>{_id}</td>
            <td className="table__wide">{clientDescription}</td>
            <td>
              <Status status={status} type="proposal" />
            </td>
            <td className="hide-at-700px">
              {tools.format(totalValue, "currency")}
            </td>
            {tools.isReadAllowed("proposal") && (
              <td className="no-padding">
                <Link to={"/proposal/" + _id}>
                  <Icon icon="edit" />
                </Link>
              </td>
            )}
          </tr>
        );
      });
  };
  render() {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="proposals" />
        <FilterBar value={this.state.filterTerm} onChange={this.updateFilter} />
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th>Proposta</th>
                <th className="table__wide">Nome do Cliente</th>
                <th>Status</th>
                <th className="hide-at-700px">Valor Total da Proposta</th>
                <th className="no-padding">
                  <Link to="/proposal/new">
                    <Icon icon="new" />
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderBody()}</tbody>
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

export default ProposalsTableWrapper = withTracker((props) => {
  const recordsToShow = 50;
  Meteor.subscribe("proposalsPub", recordsToShow);

  const database = Proposals.find().fetch() || [];

  const showMore = () => {
    Meteor.subscribe("proposalsPub", 0);
  };

  return {
    database,
    showMore,
    recordsToShow,
  };
})(ProposalsTable);
