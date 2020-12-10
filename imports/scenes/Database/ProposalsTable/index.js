import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { ReactiveVar } from "meteor/reactive-var";
import { Link } from "react-router-dom";
import RedirectUser from "/imports/components/RedirectUser/index";
import { Proposals } from "/imports/api/proposals/index";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";
import QuerySearch from "/imports/components/QuerySearch/index";
import tools from "/imports/startup/tools/index";
import Icon from "/imports/components/Icon/index";

import Status from "/imports/components/Status/index";
import ShowMore from "/imports/components/ShowMore/index";

class ProposalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.initialSubscription = {
      limit: 50,
      query: {},
    };
    this.state = {
      filterTerm: "",
    };
  }

  componentDidMount = () => {
    this.props.setSubscription(this.initialSubscription);
  };

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  };

  renderBody = () => {
    return (
      this.props.database
        // .filter((item) => {
        //   if (!item) return false;
        //   return tools.findSubstring(this.state.filterTerm, [
        //     item._id,
        //     item.clientDescription,
        //   ]);
        // })
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
        })
    );
  };
  render() {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="proposals" />
        <QuerySearch
          onChange={(term) => {
            this.props.setSubscription(
              term
                ? {
                    query: {
                      $or: [
                        {
                          clientDescription: { $regex: `(?i)${term}` },
                        },
                        { _id: { $regex: `(?i)${term}` } },
                      ],
                    },
                  }
                : this.initialSubscription
            );
          }}
        />
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
          showMore={() => this.props.setSubscription({ limit: 0 })}
          count={this.props.subscription.get().limit}
        />
      </ErrorBoundary>
    );
  }
}

const subscription = new ReactiveVar({});
const database = new ReactiveVar([]);

export default ProposalsTableWrapper = withTracker(() => {
  const { ready } = Meteor.subscribe("proposalsPub", subscription.get());

  if (ready()) {
    database.set(Proposals.find().fetch());
  }

  const setSubscription = (newOptions) => {
    const result = {
      ...subscription.get(),
      ...newOptions,
    };
    subscription.set(result);
    return result;
  };

  return {
    database: tools.sortObjects(database.get(), "_id", { reverseOrder: true }),
    setSubscription,
    subscription,
  };
})(ProposalsTable);
