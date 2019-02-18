import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

import Filter from './Filter/index';

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {}
    }
  }

  componentDidMount() {
    var filters = {};
    this.props.fields.forEach((field) => {
      filters[field] = '';
    })
    this.setState({ filters });
  }

  setFilter = (field, value) => {
    var filters = {...this.state.filters};
    filters[field] = value;

    this.setState({ filters }, () => {
      var database = tools.deepCopy(this.props.database);
      var result = [];

      for (var key of Object.keys(filters)) {
        if (!filters[key]) continue;
        database.forEach((item) => {
          if (!item.removed) {
            if (item[key] !== filters[key]) item.removed = true;
          }
        })
      }
      database.forEach((item) => {
        if (!item.removed) {
          delete item.removed;
          result.push(item);
        }
      })
      this.props.filterSearch(result);
    })
  }

  onChange = (e) => {
    var value = e.target.value;
    if (!value) {
      this.props.filterSearch(this.props.database);
    } else {
      var exportArray = this.props.database.filter((item) => {
        return item[this.props.field] === value;
      })
      this.props.filterSearch(exportArray);
    }
  }

  renderTitle = () => {
    if (this.props.field === 'place') return 'Pátio:';
  }

  renderFilters = () => {
    return this.props.fields.map((filter, i) => {
      return (
        <Filter
          key={i}
          {...this.props}
          filterIndex={i}
          field={filter}
          setFilter={this.setFilter}
        />
      )
    })
  }

  render() {
    return (
      <Block columns={this.props.fields.length}>
        {this.renderFilters()}
      </Block>
    )
  }
}