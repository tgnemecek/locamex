import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  }

  runSearch = (e) => {
    e ? e.stopPropagation() : null;
    e ? e.preventDefault() : null;

    var value = this.state.value;
    var database = this.props.database;
    var searchHere = this.props.searchHere;
    var result = [];

    if (!value) {
      this.props.filterSearch(this.props.database);
    } else {
      value = tools.removeSpecialChars(value, /[\.\/\-\(\) ]/g).toUpperCase();

      searchHere.forEach((searchField) => {
        database.forEach((item) => {
          for (var key of Object.keys(item)) {
            if (key === searchField) {
              var dbValue = item[key];
              if (typeof(dbValue) === 'number') dbValue = dbValue.toString();
              if (typeof(dbValue) === 'string') {
                if (compare(value, dbValue, tools)) {
                  result.push(item);
                  break;
                }
              }
            }
          }
        })
      })
      this.props.filterSearch(result);
    }

    function compare(inputValue, dbValue, tools) {
      inputValue = tools.removeSpecialChars(inputValue, /[\.\/\-\(\) ]/g).toUpperCase();
      dbValue = tools.removeSpecialChars(dbValue, /[\.\/\-\(\) ]/g).toUpperCase();
      return dbValue.search(inputValue) === -1 ? false : true;
    }
  }

  render() {
    return (
      <form className="search-bar">
        <div className="search-bar__search-block">
          <Input
            title="Pesquisa:"
            type="text"
            className="search-bar__search-input"
            onChange={this.onChange}
            value={this.state.value}
          />
          <button className="button--pill search-bar__button" onClick={this.runSearch}>Buscar</button>
        </div>
      </form>
    )
  }
}