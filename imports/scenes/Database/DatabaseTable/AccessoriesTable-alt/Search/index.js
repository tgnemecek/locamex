import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  }

  onClick = (e) => {
    this.setState({ value: '' }, () => {
      this.runSearch();
    });
  }

  runSearch = (e) => {
    e ? e.stopPropagation() : null;
    e ? e.preventDefault() : null;
    this.props.filterSearch(this.state.value, 'search');
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
            buttonClick={this.onClick}
            value={this.state.value}
          />
          <button className="button--pill search-bar__button" onClick={this.runSearch}>Buscar</button>
        </div>
      </form>
    )
  }
}