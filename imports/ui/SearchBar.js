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

  runSearch = () => {
    if (!this.state.value) return;

    let value = makeEqual(this.state.value);
    let j = 0;
    let result = []; 

    function makeEqual(str) {
      return customTypes.removeSpecialChars(str).toUpperCase();
    }

    this.props.database.forEach((item) => {
      j = 0;
      Object.getOwnPropertyNames(item).forEach((key) => {
        if (this.state.option == 'all' && j == 0) {
          if (makeEqual(item[key]).search(value) !== -1) {
            console.log(value, makeEqual(item[key]));
            result.push(item);
            j++;
          }
        } else if (this.state.option == key && makeEqual(item[key]).search(value) !== -1) {
            result.push(item);
            j++;
          }
      })
      return;
    })
    this.props.searchReturn(result);
  }

  render() {
    return (
      <div>
        <select value={this.state.option} onChange={this.onSelect}>
          <option value="all">Todos</option>
          {this.renderOptions()}
        </select>
        <input value={this.state.value} onChange={this.onChange} type="text"/>
        <button onClick={this.runSearch}>Buscar</button>
      </div>

    )
  }
}