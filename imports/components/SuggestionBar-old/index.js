import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class SuggestionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      value: ''
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setup();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value) {
      if (prevProps.database.length
          !== this.props.database.length
          || this.props.value !== this.state.value) {
        this.setup();
      }
    }
  }

  setup = () => {
    this.props.database.find((item) => {
      if (item._id === this.props.value) {
        this.props.onClick({
          target: {value: item._id, name: this.props.name}
        });
        this.setState({
          query: item.description,
          value: this.props.value
        });
        return true;
      }
    })
  }

  hideDropbox = () => {
    this.setState({ results: [] });
  }

  getResults = () => {
    var database = this.props.database || [];
    var query = this.state.query;
    var fields = this.props.fields || ["description"];
    var results = [];

    function compareValues(input, value) {
      input = input.toString();
      value = value.toString();

      input = tools.removeSpecialChars(input, /[\.\/\-\(\) ]/g).toUpperCase();
      value = tools.removeSpecialChars(value, /[\.\/\-\(\) ]/g).toUpperCase();

      return input.search(value) !== -1 ? true : false;
    }

    database.forEach((item) => {
      fields.forEach((field) => {
        if (compareValues(item[field], query)) {
          results.push(item);
        }
      })
    })
    this.setState({ results });
  }

  renderResults = () => {
    return this.state.results.map((item, i) => {
      const onClick = () => {
        var value = item._id;
        var exportObject = this.state.results[i] || {};
        this.props.onClick({target: {
          value,
          name: this.props.name
        }}, exportObject);

        this.setState({
          query: exportObject.description,
          value
        }, () => {
          this.hideDropbox();
        })
      }
      return (
        <li key={i}>
          <button
            onClick={onClick}>
            {item.description}
          </button>
        </li>
      )
    })
  }

  conditionalShowAll = () => {
    if (!this.state.query && this.props.showAll) {
      this.setState({ results: this.props.database });
    }
  }

  onBlur = (e) => {
    var currentTarget = e.currentTarget;
    const hideDropbox = this.hideDropbox;
    setTimeout(function() {
      if (!currentTarget.contains(document.activeElement)) {
        hideDropbox();
      }
    }, 0);
    if (!this.state.value) {
      this.setState({ query: '' });
    }
  }

  buttonClick = () => {
    this.setState({ query: '', value: '' }, () => {
      this.props.onClick({target: {value: '', name: this.props.name}}, {});
      this.conditionalShowAll();
    });
  }

  onChange = (e) => {
    this.setState({ query: e.target.value }, () => {
      if (this.state.query.length > 1) {
        this.getResults();
      } else this.hideDropbox();
    });
  }

  render() {
    return (
      <div className={this.props.className ? this.props.className + " suggestion-bar" : "suggestion-bar"} onBlur={this.onBlur} onFocus={this.conditionalShowAll}>
        <div className="suggestion-bar__magnifier" style={this.props.title ? {top: "2.5rem"} : {top: "1rem"}}>
          <Icon icon="search" />
        </div>
        <Input
          title={this.props.title}
          type="text"
          style={this.props.style}
          onChange={this.onChange}
          buttonClick={this.buttonClick}
          disabled={this.props.disabled}
          error={this.props.error}
          value={this.state.query}/>
        {this.state.results.length > 0 ?
          <ul className="suggestion-bar__dropbox">
            {this.renderResults()}
          </ul>
        : null}
      </div>
    )
  }
}