import React from 'react';
import { Accessories } from '/imports/api/accessories/index';
import { Categories } from '/imports/api/categories/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import SearchBar from '/imports/components/SearchBar/index';
import RegisterAccessories from '/imports/components/RegisterAccessories/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class AccessoriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      categoriesDb: [],
      ready: 0
    }
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('accessoriesPub');
      Meteor.subscribe('categoriesPub');
      var fullDatabase = Accessories.find().fetch();
      var filteredDatabase = fullDatabase;
      var categoriesDb = Categories.find().fetch();
      if (fullDatabase) this.setState({ fullDatabase, filteredDatabase, categoriesDb, ready: 1 });
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
        <th>Descrição</th>
        <th className="small-column">Disponíveis</th>
        <th className="small-column">Locados</th>
        <th className="small-column">Manutenção</th>
        <th className="small-column">Total</th>
        <th className="small-column">Valor</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var category;
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      for (var j = 0; j < this.state.categoriesDb.length; j++) {
        if (this.state.categoriesDb[j]._id === item.category) {
          category = this.state.categoriesDb[j].description;
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
          <table className="table database__table database__table--accessories">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.props.item ?
            <RegisterAccessories
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