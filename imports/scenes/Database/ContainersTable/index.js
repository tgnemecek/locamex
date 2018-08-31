import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import RegisterContainers from '/imports/components/RegisterContainers/index';
import SortButton from '/imports/components/SortButton/index';

export default class ContainersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { placesDatabase: [] };
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('placesPub');
      var placesDatabase = Places.find({ visible: true }).fetch();
      this.setState({ placesDatabase });
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
        <th className="small-column">Série</th>
        <th>Descrição</th>
        <th className="small-column">Tipo</th>
        <th className="small-column">Status</th>
        <th className="small-column">Pátio</th>
        <th className="small-column">Valor Mensal</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }
  renderBody = () => {
    return this.props.database.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      function translate (input) {
        if (input === 'available') return 'Disponível';
        if (input === 'rented') return 'Alugado';
        if (input === 'maintenance') return 'Manutenção';
        if (input === 'inactive') return 'Inativo';
        if (input === 'fixed') return 'Fixo';
        if (input === 'modular') return 'Modular';
        return input;
      }
      const translatePlaces = (place) => {
        if (!place) return "-";
        for (var i = 0; i < this.state.placesDatabase.length; i++) {
          if (this.state.placesDatabase[i]._id === place) {
            return this.state.placesDatabase[i].description;
          }
        } return "-";
      }
      return (
        <tr key={i}>
          <td className="small-column">{item._id}</td>
          <td>{item.description}</td>
          <td className="small-column">{translate(item.type)}</td>
          <td className="small-column">{translate(item.status) || "Montados: " + item.assembled}</td>
          <td className="small-column">{translatePlaces(item.place)}</td>
          <td className="small-column">{tools.format(item.price, 'currency')}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }
  render () {
    return (
      <ErrorBoundary>
        <table className="table database__table database__table--accessories">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        {this.props.item ?
          <RegisterContainers
            item={this.props.item}
            toggleWindow={this.props.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}