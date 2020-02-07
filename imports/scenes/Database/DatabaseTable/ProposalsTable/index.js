import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Proposals } from '/imports/api/proposals/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';
import Status from '/imports/components/Status/index';
import ShowMore from '/imports/components/ShowMore/index';

class ProposalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: []
    }
  }
  componentDidMount() {
    this.setState({ filteredDatabase: this.props.fullDatabase });
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ filteredDatabase: this.props.fullDatabase });
    }
  }
  filterSearch = (filteredDatabase) => {
    this.setState({ filteredDatabase });
  }
  renderHeader = () => {
    return (
      <tr>
        <th className="table__small-column">Proposta</th>
        <th>Nome do Cliente</th>
        <th className="table__small-column">Status</th>
        <th className="table__small-column hide-at-700px">Valor Total da Proposta</th>
        <th className="table__small-column">
          <Link to="/proposal/new">
            <Icon icon="new" />
          </Link>
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      if (!item) return null;
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      const totalValue = () => {
        var duration = item.dates.timeUnit === "months" ? item.dates.duration : 1;
        var discount = item.discount;

        var containers = item.containers || [];
        var accessories = item.accessories || [];
        var products = containers.concat(accessories);
        var productsValue = products.reduce((acc, current) => {
          var renting = current.renting || 1;
          return acc + (current.price * renting * duration)
        }, 0);
        productsValue = productsValue * (1 - discount);

        var services = item.services || [];
        var servicesValue = services.reduce((acc, current) => {
          var renting = current.renting ? current.renting : 1;
          return acc + (current.price * renting)
        }, 0);

        return tools.format((productsValue + servicesValue), "currency");
      }
      const renderProposalButton = () => {
        if (tools.isReadAllowed("proposal")) {
          return (
            <td className="table__small-column">
              <Link key={i} to={"/proposal/" + item._id}>
                <Icon icon="edit"/>
              </Link>
            </td>
          )
        } else return null;
      }
      const renderShippingButton = () => {
        if (tools.isReadAllowed("shipping") && item.status === "active") {
          return (
            <td className="table__small-column">
              <Link key={i} to={"/shipping/" + item._id}>
                <Icon icon="transaction"/>
              </Link>
            </td>
          )
        } else return null;
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{item._id}</td>
          <td>{item.client.description}</td>
          <td className="table__small-column"><Status status={item.status} type="proposal"/></td>
          <td className="table__small-column hide-at-700px">{totalValue()}</td>
          {renderProposalButton()}
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="proposals"/>
          <SearchBar
            database={this.props.fullDatabase}
            searchHere={['_id', 'clientName']}
            filterSearch={this.filterSearch}
          />
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
          <ShowMore
            showMore={this.props.showMore}
            numberOfRecords={this.props.recordsToShow}
          />
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

export default ProposalsTableWrapper = withTracker((props) => {
  var recordsToShow = 50;
  Meteor.subscribe('proposalsPub', recordsToShow);
  var fullDatabase = Proposals.find().fetch();
  fullDatabase = tools.sortObjects(fullDatabase, '_id', {reverseOrder: true});
  fullDatabase = fullDatabase.map((item) => {
    var newItem = tools.explodeProposal(item);
    newItem.clientName = newItem.client.description;
    return newItem;
  })
  var ready = !!fullDatabase.length;

  const showMore = () => {
    recordsToShow = 0; // all records
    Meteor.subscribe('proposalsPub', recordsToShow);
  }

  return {
    fullDatabase,
    ready,
    showMore,
    recordsToShow
  }
})(ProposalsTable);