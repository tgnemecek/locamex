import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Icon from '/imports/components/Icon/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ModulesTable extends React.Component {
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
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    const generateReport = () => {
      var header = [[
        "Descrição",
        "Disponíveis",
        "Locados",
        "Inativos",
        "Total"
      ]]
      var body = this.props.fullDatabase.map((item) => {
        var available = count(item.place, 'available');
        var inactive = count(item.place, 'inactive');
        return [
          item.description,
          available,
          item.rented,
          inactive,
          available + item.rented + inactive
        ]
      })
      this.props.generateReport(header.concat(body));
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="table__small-column">Disponíveis</th>
        <th className="table__small-column">Locados</th>
        <th className="table__small-column">Inativos</th>
        <th className="table__small-column">Total</th>
        <th className="table__small-column">
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th className="table__small-column">
          <button onClick={toggleEditWindow}>
            <Icon icon="new" />
          </button>
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleStockVisualizer = () => {
        this.props.toggleStockVisualizer(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      var available = count(item.place, 'available');
      var inactive = count(item.place, 'inactive');
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{available}</td>
          <td className="table__small-column">{item.rented}</td>
          <td className="table__small-column">{inactive}</td>
          <td className="table__small-column">{available + item.rented + inactive}</td>
          <td className="table__small-column">
            <button onClick={toggleEditWindow}>
              <Icon icon="edit" />
            </button>
          </td>
          <td className="table__small-column">
            <button onClick={toggleStockVisualizer}>
              <Icon icon="transaction"  />
            </button>
          </td>
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="modules"/>
          <SearchBar
            database={this.props.fullDatabase}
            searchHere={['description']}
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

function count(places, which) {
  return places.reduce((acc, cur) => {
    return acc + cur[which];
  }, 0);
}

export default ModulesTableWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var fullDatabase = Modules.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ModulesTable);