import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import { Packs } from '/imports/api/packs/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class PacksTable extends React.Component {

  renderHeader = () => {
    return (
      <tr>
        <th>Descrição</th>
        <th className="table__small-column">Status</th>
        <th className="table__small-column">Pátio</th>
      </tr>
    )
  }

  renderBody = () => {
    return this.props.fullDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleTransactionWindow = () => {
        this.props.toggleTransactionWindow(item);
      }
      const translatePlaces = (place) => {
        if (!place) return "-";
        for (var i = 0; i < this.props.placesDatabase.length; i++) {
          if (this.props.placesDatabase[i]._id === place) {
            return this.props.placesDatabase[i].description;
          }
        } return "-";
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{tools.translateStatus(item.status, false)}</td>
          <td className="table__small-column">{translatePlaces(item.place)}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>🔍</button></td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleTransactionWindow}>⟳</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="packs"/>
          <div className="database__scroll-div">
            <table className="table">
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
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
          </table>
        </div>
      )
    }
  }
}

export default PacksTableWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  Meteor.subscribe('packsPub');
  var fullDatabase = Packs.find().fetch();
  var placesDatabase = Places.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    placesDatabase,
    ready
  }
})(PacksTable);