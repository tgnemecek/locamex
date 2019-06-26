import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Proposals } from '/imports/api/proposals/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';
import Status from '/imports/components/Status/index';

class ProposalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],

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
        <th className="table__small-column">Valor Total da Proposta</th>
        <th className="table__small-column">
          <Button to="/proposal/new" icon="new" />
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
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
        if (tools.isUserAllowed("proposal")) {
          return (
            <td className="table__small-column">
              <Button key={i} icon="edit" to={"/proposal/" + item._id} />
            </td>
          )
        } else return null;
      }
      const renderShippingButton = () => {
        if (tools.isUserAllowed("shipping") && item.status === "active") {
          return (
            <td className="table__small-column">
              <Button key={i} icon="transaction" to={"/shipping/" + item._id} />
            </td>
          )
        } else return null;
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{item._id}</td>
          <td>{item.client.description}</td>
          <td className="table__small-column"><Status status={item.status} type="proposal"/></td>
          <td className="table__small-column">{totalValue()}</td>
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
            searchHere={['_id']}
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
  Meteor.subscribe('proposalsPub');
  Meteor.subscribe('usersPub');
  var fullDatabase = Proposals.find().fetch();
  fullDatabase = tools.sortObjects(fullDatabase, '_id', {reverseOrder: true});
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ProposalsTable);