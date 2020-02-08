import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Proposals } from '/imports/api/proposals/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import FilterBar from '/imports/components/FilterBar/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';

import Status from '/imports/components/Status/index';
import ShowMore from '/imports/components/ShowMore/index';

class ProposalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: ''
    }
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  }

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        return tools.findSubstring(this.state.filterTerm, [
          item._id, item.clientName, item.clientDescription
        ])
      })
      .map((item, i) => {
        if (!item) return null;
        const renderProposalButton = () => {
          if (tools.isReadAllowed("proposal")) {
            return (
              <td>
                <Link key={i} to={"/proposal/" + item._id}>
                  <Icon icon="edit"/>
                </Link>
              </td>
            )
          } else return null;
        }
        return (
          <tr key={i}>
            <td>{item._id}</td>
            <td className="table__wide">{item.clientDescription}</td>
            <td><Status status={item.status} type="proposal"/></td>
            <td className="hide-at-700px">
              {tools.format((
                tools.totalValue(item.snapshots[item.index])
              ), "currency")}
            </td>
            {renderProposalButton()}
          </tr>
        )
      })
  }
  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="proposals"/>
        <FilterBar
          value={this.state.filterTerm}
          onChange={this.updateFilter}/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th>Proposta</th>
                <th className="table__wide">Nome do Cliente</th>
                <th>Status</th>
                <th className="hide-at-700px">Valor Total da Proposta</th>
                <th>
                  <Link to="/proposal/new">
                    <Icon icon="new" />
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          <ShowMore
            showMore={this.props.showMore}
            numberOfRecords={this.props.recordsToShow}
          />
        </div>
      </ErrorBoundary>
    )
  }
}

export default ProposalsTableWrapper = withTracker((props) => {
  var recordsToShow = 50;
  Meteor.subscribe('proposalsPub', recordsToShow);
  var database = Proposals.find().fetch();
  database = tools.sortObjects(database, '_id', {reverseOrder: true});

  database = database.map((proposal) => {
    var index = proposal.snapshots.length-1;
    if (proposal.status === 'active') {
      index = proposal.snapshots.findIndex((snapshot) => {
        return snapshot.active;
      })
    }
    var client = proposal.snapshots[index].client;
    return {
      ...proposal,
      index,
      clientDescription: client.description,
      clientName: client.name
    }
  })

  const showMore = () => {
    recordsToShow = 0; // all records
    Meteor.subscribe('proposalsPub', recordsToShow);
  }

  return {
    database,
    showMore,
    recordsToShow
  }
})(ProposalsTable);