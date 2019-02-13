import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    var options = {
      filters: [],
      dontSearchHere: [],
      onlySearchHere: [],
      ...this.props.options
    }
    options.dontSearchHere.push("_id");
    this.state = {
      options,
      value: ''
    }
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  }

  onSelect = (e) => {
    this.setState({options: e.target.value});
  }

  renderOptions = () => {
    return this.props.options.map((options, i) => {
      return <options key={i} value={options.value}>{options.title}</options>
    })
  }

  runSearch = (e) => {
    e ? e.stopPropagation() : null;
    e ? e.preventDefault() : null;

    var value = makeEqual(this.state.value);
    var database = this.props.database;
    var options = this.state.options;
    var result = [];

    const filterArray = (array, filters) => {
      var array = tools.deepCopy(array);

      if (filters.length) {
        for (var i = 0; i < array.length; i++) {
          debugger;
          for (var j = 0; j < filters.length; j++) {
            if (filters[j].selected !== "") {
              if (array[i][filters[j].key]) {
                if (array[i][filters[j].key] !== filters[j].selected) {
                  array[i] = undefined;
                  break;
                }
              } else {
                array[i] = undefined;
                break;
              }
            }
          }
        }
      } else return array;

      var exportArray = [];
      array.forEach((item) => {
        if (item) exportArray.push(item);
      })
      return exportArray;
    }

    if (!this.state.value) {
      result = filterArray(this.props.database, this.state.options.filters);
      this.props.searchReturn(result);
      return;
    }

    function makeEqual(str) {
      return tools.removeSpecialChars(str, /[\.\/\-\(\) ]/g).toUpperCase();
    }

    function compareOption(key) {
      for (var i = 0; i < options.dontSearchHere.length; i++) {
        if (options.dontSearchHere[i] === key) {
          return false;
        }
      }
      for (var i = 0; i < options.onlySearchHere.length; i++) {
        if (options.onlySearchHere[i] === key) {
          return true;
        }
      }
      return options.onlySearchHere.length ? false : true;
    }

    function compare(keyValue) {
      return makeEqual(keyValue).search(value) === -1 ? false : true;
    }

    function searchInsideObject(object) {
      for (let key of Object.keys(object)) {
        if (Array.isArray(object[key])) {
          return searchInsideArray(object[key]);
        } else {
          if (!compareOption(key)) continue;
          if (compare(object[key])) return true;
        }
      }
      return false;
    }

    function searchInsideArray(array) {
      if (!Array.isArray(array)) return false;
      for (var j = 0; j < array.length; j++) {
        if (typeof(array[j]) == 'object') {
          if (searchInsideObject(array[j])) return true;
        } else return compare(array[j]) ? true : false;
      }
    }

    for (var i = 0; i < database.length; i++) {
      if (searchInsideObject(database[i])) {
        result.push(database[i]);
      }
    }
    result = filterArray(result, this.state.options.filters);
    this.props.searchReturn(result);
  }

  renderFilters = () => {
    const onChange = (e) => {
      var options = tools.deepCopy(this.state.options);
      var value = e.target.value;
      var i = e.target.name;
      options.filters[i].selected = value;
      this.setState({ options }, () => {
        this.runSearch();
      });
    }
    return this.state.options.filters.map((filter, i) => {
      const renderOptions = () => {
        return filter.options.map((option, i) => {
          return <option key={i} value={option.value}>{option.label}</option>
        })
      }
      return <Input
              key={i}
              type="select"
              name={i}
              className=""
              title={filter.label}
              value={filter.selected}
              onChange={onChange}>
              <option>Tudo</option>
              {renderOptions()}
            </Input>
    })
  }

  render() {
    return (
      <form className="search-bar">
        <div className="search-bar__search-block">
          <Input
            title="Pesquisa:"
            type="text"
            className="search-bar__search-input"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button className="button--pill search-bar__button" onClick={this.runSearch}>Buscar</button>
        </div>
        {this.state.options.filters ?
          <Block columns={this.state.options.filters.length}>
            {this.renderFilters()}
          </Block>
        : null}
      </form>
    )
  }
}