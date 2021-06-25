import React from "react";
import tools from "/imports/startup/tools/index";
import Table from "./Table/index";
import ManageItems from "./ManageItems/index";

export default class MainItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowType: false,
      database: [],
      key: 0,
    };
  }
  toggleWindow = (type) => {
    var database;
    if (type === "containers") {
      database = this.props.databases.containersDatabase;
    } else if (type === "accessories") {
      database = this.props.databases.accessoriesDatabase;
    } else if (type === "services") {
      database = this.props.databases.servicesDatabase;
    }
    if (!this.props.disabled) {
      this.setState({
        windowType: this.state.windowType ? false : type,
        database,
        key: tools.generateId(),
      });
    }
  };
  getRelevantRentedItems = () => {
    const { currentlyRented } = this.props;
    const { windowType } = this.state;
    const result = {};

    if (!currentlyRented) return {};

    if (windowType === "containers") {
      [...currentlyRented.series, ...currentlyRented.packs].forEach((item) => {
        result[item.container._id] = true;
      });
    } else if (windowType === "accessories") {
      currentlyRented.variations.forEach((item) => {
        result[item.accessory._id] = true;
      });
    }
    return result;
  };

  render() {
    return (
      <div className="main-items">
        <div className="main-items__list">
          <h3>Containers:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.snapshot.containers}
            toggleWindow={() => this.toggleWindow("containers")}
          />
        </div>
        <div className="main-items__list">
          <h3>Acessórios:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.snapshot.accessories}
            toggleWindow={() => this.toggleWindow("accessories")}
          />
        </div>
        <div className="main-items__list">
          <h3>Serviços:</h3>
          <Table
            disabled={this.props.disabled}
            addedItems={this.props.snapshot.services}
            toggleWindow={() => this.toggleWindow("services")}
          />
        </div>
        {this.state.windowType ? (
          <ManageItems
            key={this.state.key}
            type={this.state.windowType}
            toggleWindow={this.toggleWindow}
            fullDatabase={this.state.database}
            snapshot={this.props.snapshot}
            updateSnapshot={this.props.updateSnapshot}
            docType={this.props.docType}
            currentlyRented={this.getRelevantRentedItems()}
          />
        ) : null}
      </div>
    );
  }
}