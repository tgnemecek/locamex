import React from 'react';
import { Clients } from '/imports/api/clients/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import RegisterClients from '/imports/components/RegisterClients/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class ClientsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      ready: 0
    }
  }

  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var fullDatabase = Clients.find({ visible: true }).fetch();
      var filteredDatabase = fullDatabase;
      if (fullDatabase) this.setState({ fullDatabase, filteredDatabase, ready: 1 });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
  }

  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th>Nome Fantasia</th>
        <th className="small-column">Tipo</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="small-column">{item.type === 'company' ? "PJ" : "PF"}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.state.ready === 1) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.state.fullDatabase}
            options={this.searchOptions}
            searchReturn={this.searchReturn}
          />
          <table className="table database__table database__table--clients">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.props.item ?
            <RegisterClients
              item={this.props.item}
              toggleWindow={this.props.toggleWindow}
            />
          : null}
        </ErrorBoundary>
      )
    } else if (this.state.ready === 0) {
      return <Loading/>
    } else if (this.state.ready === -1) {
      return <NotFound/>
    }
  }
}