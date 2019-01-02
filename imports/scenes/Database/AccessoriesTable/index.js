import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accessories } from '/imports/api/accessories/index';
import { Categories } from '/imports/api/categories/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class AccessoriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['description']
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ filteredDatabase: this.props.fullDatabase });
    }
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow({});
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="small-column">Disponíveis</th>
        <th className="small-column">Locados</th>
        <th className="small-column">Manutenção</th>
        <th className="small-column">Total</th>
        <th className="small-column">Valor</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
        <th className="small-column"></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var category;
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      for (var j = 0; j < this.props.categoriesDatabase.length; j++) {
        if (this.props.categoriesDatabase[j]._id === item.category) {
          category = this.props.categoriesDatabase[j].description;
          break;
        }
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="small-column">{item.available}</td>
          <td className="small-column">{item.rented}</td>
          <td className="small-column">{item.maintenance}</td>
          <td className="small-column">{(item.available + item.rented + item.maintenance).toString()}</td>
          <td className="small-column">{tools.format(item.price, 'currency')}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
          <td className="small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
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
            <table className="table database__table database__table--accessories">
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
      return null;
    }
  }
}

export default AccessoriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('categoriesPub');
  var fullDatabase = Accessories.find().fetch();
  var categoriesDatabase = Categories.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    categoriesDatabase,
    ready
  }
})(AccessoriesTable);