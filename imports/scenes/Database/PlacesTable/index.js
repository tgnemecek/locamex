import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import RegisterData from '/imports/components/RegisterData/index';

class PlacesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: false
    }
  }

  toggleWindow = (item) => {
    if (this.state.item) {
      this.setState({ item: false });
    } else {
      this.setState({ item });
    }
  }

  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="places"/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Pátio</th>
                {tools.isWriteAllowed('places') ?
                  <th>
                    <button onClick={() => this.toggleWindow({})}>
                      <Icon icon="new" />
                    </button>
                  </th>
                : null}
              </tr>
            </thead>
            <tbody>
              {this.props.database.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className="table__wide">{item.description}</td>
                    {tools.isWriteAllowed('places') ?
                      <td>
                        <button onClick={() => this.toggleWindow(item)}>
                          <Icon icon="edit" />
                        </button>
                      </td>
                    : null}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {this.state.item ?
          <RegisterData
            type='places'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default PlacesTableWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var database = Places.find().fetch() || [];
  return {
    database
  }
})(PlacesTable);