import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Services } from "/imports/api/services/index";
import tools from "/imports/startup/tools/index";

import RegisterData from "/imports/components/RegisterData/index";
import FilterBar from "/imports/components/FilterBar/index";

import Icon from "/imports/components/Icon/index";
import RedirectUser from "/imports/components/RedirectUser/index";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";

class ServicesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: "",
      item: false,
    };
  }

  toggleWindow = (item) => {
    if (this.state.item) {
      this.setState({ item: false });
    } else {
      this.setState({ item });
    }
  };

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  };

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        return tools.findSubstring(this.state.filterTerm, item.description);
      })
      .map((item, i) => {
        return (
          <tr key={i}>
            <td className="table__wide">{item.description}</td>
            <td>{tools.format(item.price, "currency")}</td>
            <td className="no-padding">
              <button onClick={() => this.toggleWindow(item)}>
                <Icon icon="edit" />
              </button>
            </td>
          </tr>
        );
      });
  };

  render() {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="services" />
        <FilterBar value={this.state.filterTerm} onChange={this.updateFilter} />
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Descrição</th>
                <th>Valor</th>
                <th className="no-padding">
                  <button onClick={() => this.toggleWindow({})}>
                    <Icon icon="new" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderBody()}</tbody>
          </table>
        </div>
        {this.state.item ? (
          <RegisterData
            type="services"
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        ) : null}
      </ErrorBoundary>
    );
  }
}

export default ServicesTableWrapper = withTracker((props) => {
  Meteor.subscribe("servicesPub");
  var database = Services.find().fetch() || [];
  return {
    database,
  };
})(ServicesTable);
