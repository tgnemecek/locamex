import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Categories } from '/imports/api/categories/index';
import tools from '/imports/startup/tools/index';
import RegisterAccessories from '/imports/components/RegisterAccessories/index';
import SortButton from '/imports/components/SortButton/index';

export default class AccessoriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { categoriesDb: [] };
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('categoriesPub');
      var categoriesDb = Categories.find({ visible: true }).fetch();
      this.setState({ categoriesDb });
    })
  }
  renderSortButton = (attribute) => {
    return <SortButton
              database={this.props.database}
              attribute={attribute}
              returnSort={this.props.returnSort}/>
  }
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th className="small-column">Código</th>
        <th>Descrição</th>
        <th className="small-column">Categoria</th>
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
    return this.props.database.map((item, i) => {
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
          <td className="small-column">{item._id}</td>
          <td>{item.description}</td>
          <td className="small-column">{category}</td>
          <td className="small-column">{item.available}</td>
          <td className="small-column">{item.rented}</td>
          <td className="small-column">{item.maintenance}</td>
          <td className="small-column">{item.available + item.rented + item.maintenance}</td>
          <td className="small-column">{tools.format(item.price, 'currency')}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }
  render () {
    return (
      <ErrorBoundary>
        <table className="database__table database__table--accessories">
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
  }
}