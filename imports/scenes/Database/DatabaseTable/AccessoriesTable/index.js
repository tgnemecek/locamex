import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accessories } from '/imports/api/accessories/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Button from '/imports/components/Button/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class AccessoriesTable extends React.Component {
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
        "Total",
        "Valor Mensal"
      ]]
      var body = this.state.filteredDatabase.map((item) => {
        var available = count(item, 'available');
        var rented = countRented(item);
        var inactive = count(item, 'inactive');
        return [
          item.description,
          available,
          rented,
          inactive,
          available + rented + inactive,
          item.price
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
        <th className="table__small-column">Valor Mensal</th>
        <th className="table__small-column">
          <Button icon="report" onClick={generateReport} />
        </th>
        <th className="table__small-column">
          <Button icon="new" onClick={toggleEditWindow} />
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
      const renderEditButton = () => {
        if (tools.isUserAllowed("accessories.edit")) {
          return (
            <td className="table__small-column">
              <Button icon="edit" onClick={toggleEditWindow} />
            </td>
          )
        } else return null;
      }
      const renderStockButton = () => {
        if (tools.isUserAllowed("accessories.stock")) {
          return <td className="table__small-column"><Button icon="transaction" onClick={toggleStockVisualizer} /></td>
        } else return null;
      }
      var available = count(item, 'available');
      var rented = countRented(item);
      var inactive = count(item, 'inactive');
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{available}</td>
          <td className="table__small-column">{rented}</td>
          <td className="table__small-column">{inactive}</td>
          <td className="table__small-column">{available + rented + inactive}</td>
          <td className="table__small-column">{tools.format(item.price, 'currency')}</td>
          {renderEditButton()}
          {renderStockButton()}
          <td className="table__small-column">
            <Button icon="image" onClick={toggleImageWindow} />
        </td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="accessories"/>
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

function count(item, which) {
  var result = 0;
  item.variations.forEach((variation) => {
    result = result + variation.place.reduce((acc, cur) => {
      return acc + cur[which];
    }, 0);
  })
  return result;
}

function countRented(item) {
  var result = 0;
  return item.variations.reduce((acc, cur) => {
    return acc + cur.rented;
  }, 0);
}

export default AccessoriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('accessoriesPub');
  var fullDatabase = Accessories.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(AccessoriesTable);