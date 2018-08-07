import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: 'all',
      value: ''
    }
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  }

  onSelect = (e) => {
    this.setState({option: e.target.value});
  }

  renderOptions = () => {
    return this.props.options.map((option, i) => {
      return <option key={i} value={option.value}>{option.title}</option>
    })
  }

  runSearch = (e) => {
    e.preventDefault();

    if (!this.state.value) {
      this.props.searchReturn(false);
      return;
    }

    var value = makeEqual(this.state.value);
    let database = this.props.database;
    let result = [];

    function makeEqual(str) {
      return customTypes.removeSpecialChars(str, /[\.\/\-\(\) ]/g).toUpperCase();
    }

    function compare(keyValue) {
      return makeEqual(keyValue).search(value) === -1 ? false : true;
    }

    function searchInsideObject(object) {
      for (let key of Object.keys(object)) {
        if (Array.isArray(object[key])) {
          return searchInsideArray(object[key]);
        } else if (compare(object[key])) return true;
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
          <select value={this.state.option} onChange={this.onSelect}>
            <option value="all">Todos</option>
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