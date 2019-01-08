import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Services } from '/imports/api/services/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ServicesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['description']
      }
    }
  }

  componentDidMount() {
    this.updateDatabases();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateDatabases();
    }
  }

  updateDatabases = () => {
    this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="small-column">Valor</th>
        <th className="small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="small-column">{tools.format(item.price, 'currency')}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.props.fullDatabase}
            options={this.state.searchOptions}
            searchReturn={this.searchReturn}
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

export default ServicesTableWrapper = withTracker((props) => {
  Meteor.subscribe('servicesPub');
  var fullDatabase = Services.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ServicesTable);