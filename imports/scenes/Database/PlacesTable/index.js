import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class PlacesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: []
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

  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow({});
    }
    return (
      <tr>
        <th>Pátio</th>
        <td className="small-column">Containers</td>
        <td className="small-column">Acessórios</td>
        <td className="small-column">Componentes</td>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
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
          <td className="small-column">{item.containers}</td>
          <td className="small-column">{item.accessories}</td>
          <td className="small-column">{item.modules}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
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