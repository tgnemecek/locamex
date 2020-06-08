import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Series } from "/imports/api/series/index";
import { Packs } from "/imports/api/packs/index";
import ImageVisualizer from "/imports/components/ImageVisualizer/index";
import RegisterData from "/imports/components/RegisterData/index";
import tools from "/imports/startup/tools/index";
import Icon from "/imports/components/Icon/index";
import Input from "/imports/components/Input/index";
import RedirectUser from "/imports/components/RedirectUser/index";
import ErrorBoundary from "/imports/components/ErrorBoundary/index";

class SeriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterIdContainer: "",
      filterIdPlace: "",
      windowType: false,
      item: false,
    };
  }

  toggleWindow = (item, windowType) => {
    if (!this.state.windowType) {
      this.setState({
        item,
        windowType,
      });
    } else {
      this.setState({
        item: false,
        windowType: false,
      });
    }
  };

  setFilter = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderFilterOptions = (type) => {
    var uniques = [];
    return this.props.database
      .filter((item) => {
        if (!item[type]._id) return false;
        if (uniques.includes(item[type]._id)) {
          return false;
        } else {
          uniques.push(item[type]._id);
          return true;
        }
      })
      .map((item, i) => {
        return (
          <option key={i} value={item[type]._id}>
            {item[type].description}
          </option>
        );
      });
  };

  renderHeader = () => {
    const generateReport = () => {
      var header = [["Série", "Modelo", "Pátio", "Observações"]];
      var body = this.props.database.map((item) => {
        return [
          item.description,
          item.container.description,
          item.place.description,
          item.observations,
        ];
      });
      this.props.generateReport(header.concat(body));
    };
    return (
      <tr>
        <th>Série</th>
        <th className="table__wide">Modelo</th>
        <th>Pátio</th>
        <th className="no-padding">
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th className="no-padding">
          <button onClick={() => this.toggleWindow({}, "edit")}>
            <Icon icon="new" />
          </button>
        </th>
      </tr>
    );
  };

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        if (this.state.filterIdContainer) {
          if (item.container._id !== this.state.filterIdContainer) {
            return false;
          }
        }
        if (this.state.filterIdPlace) {
          if (item.place._id !== this.state.filterIdPlace) {
            return false;
          }
        }
        return true;
      })
      .map((item, i) => {
        return (
          <tr key={i}>
            <td>{item.description}</td>
            <td style={{ textAlign: "left" }}>{item.container.description}</td>
            <td>{item.rented ? "Alugado" : item.place.description}</td>
            <td className="no-padding">
              <button onClick={() => this.toggleWindow(item, "edit")}>
                <Icon icon="edit" />
              </button>
            </td>
            <td className="no-padding">
              {item.type === "series" ? (
                <button onClick={() => this.toggleWindow(item, "image")}>
                  <Icon icon="image" />
                </button>
              ) : null}
            </td>
          </tr>
        );
      });
  };

  render() {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="series" />
        <div className="database__series-filter">
          <Input
            title="Modelo"
            type="select"
            name="filterIdContainer"
            onChange={this.setFilter}
          >
            <option value="" style={{ fontStyle: "italic" }}>
              Mostrar Tudo
            </option>
            {this.renderFilterOptions("container")}
          </Input>
          <Input
            title="Pátio"
            type="select"
            name="filterIdPlace"
            onChange={this.setFilter}
          >
            <option value="" style={{ fontStyle: "italic" }}>
              Mostrar Tudo
            </option>
            {this.renderFilterOptions("place")}
          </Input>
        </div>
        <div className="database__scroll-div">
          <table className="table">
            <thead>{this.renderHeader()}</thead>
            <tbody>{this.renderBody()}</tbody>
          </table>
        </div>
        {this.state.windowType === "edit" ? (
          <RegisterData
            type={this.state.item.type || "series"}
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        ) : null}
        {this.state.windowType === "image" ? (
          <ImageVisualizer
            item={this.props.database.find((item) => {
              return item._id === this.state.item._id;
            })}
            toggleWindow={this.toggleWindow}
          />
        ) : null}
      </ErrorBoundary>
    );
  }
}

export default SeriesTableWrapper = withTracker((props) => {
  Meteor.subscribe("seriesPub");
  Meteor.subscribe("packsPub");

  var series = Series.find().fetch() || [];
  var packs =
    Packs.find({ $and: [{ rented: false }, { visible: true }] }).fetch() || [];

  var database = [...packs, ...series];

  return {
    database,
  };
})(SeriesTable);
