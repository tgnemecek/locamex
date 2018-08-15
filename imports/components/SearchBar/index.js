import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '/imports/startup/custom-types';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.hiddenOption ? this.props.hiddenOption : 'all',
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
    e.preventDefault();

    if (!this.state.value) {
      this.props.searchReturn(false);
      return;
    }

    var value = makeEqual(this.state.value);
    var database = this.props.database;
    var options = this.state.options;
    var result = [];

    function makeEqual(str) {
      return customTypes.removeSpecialChars(str, /[\.\/\-\(\) ]/g).toUpperCase();
    }

    function compareOption(key) {
      var res = false;
      if (options == 'all') return true;
      if (typeof(options) == 'string') {
        res = options == key ? true : false;
      } else if (Array.isArray(options)) {
        for (var i = 0; i < options.length; i++) {
          if (options[i] == key) return true;
        }
      }
      return res;
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
    this.props.searchReturn(result);
  }


  render() {
    return (
      <form className="search-bar">
        {this.props.options ? <div className="search-bar__block">
          <select value={this.state.options} onChange={this.onSelect}>
            <options value="all">Todos</options>
            {this.renderOptions()}
          </select>
        </div> : null}
        <div className="search-bar__block search-bar__block--main">
          <label>Pesquisa:</label>
          <input value={this.state.value} onChange={this.onChange} type="text"/>
        </div>
        <div className="search-bar__block">
          <button className="button--pill button--search-bar" onClick={this.runSearch}>Buscar</button>
        </div>
      </form>
    )
  }
}