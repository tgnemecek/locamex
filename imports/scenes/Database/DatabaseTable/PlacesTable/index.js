import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class PlacesTable extends React.Component {

  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Pátio</th>
        <th className="table__small-column"><Icon icon="new" onClick={toggleEditWindow} /></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.props.fullDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
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
          <td className="table__small-column"><Icon icon="edit" onClick={toggleEditWindow} /></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="places"/>
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

export default PlacesTableWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var fullDatabase = Places.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(PlacesTable);