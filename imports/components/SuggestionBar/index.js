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
      input: ''
    }
  }

  renderResults = () => {
    const getResults = () => {
      if (this.props.showAll && !this.state.result) return database;
      if (this.props.value._id) return [];

      var database = this.props.database || [];
      var input = this.state.input;
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
          if (compareValues(item[field], input)) {
            results.push(item);
          }
        })
      })
      return results;
    }

    if (this.state.input.length < 3) {
      return null;
    }
    var filtered = getResults();
    if (filtered.length === 0) return null;
    return (
      <ul className="suggestion-bar__dropbox">
        {filtered.map((item, i) => {
          const onClick = () => {
            this.props.onChange(item);
          }
          return (
            <li key={i}>
              <button
                onClick={onClick}>
                {item.description}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  onChange = (e) => {
    this.setState({ input: e.target.value });
  }

  buttonClick = () => {
    this.setState({ input: '' }, () => {
      this.props.onChange({});
    });
  }

  onBlur = (e) => {
    var currentTarget = e.currentTarget;
    const hideDropbox = this.hideDropbox;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ input: '' });
      }
    }, 0);
  }

  className = () => {
    if (this.props.className) {
      return this.props.className + " suggestion-bar";
    } else {
      return "suggestion-bar";
    }
  }

  render() {
    return (
      <div className={this.className()}
        onBlur={this.onBlur}
        onFocus={this.conditionalShowAll}>
        <Input
          title={this.props.title}
          type="text"
          style={this.props.style}
          onChange={this.onChange}
          buttonClick={this.buttonClick}
          childrenSide="left"
          disabled={this.props.disabled}
          error={this.props.error}
          value={this.props.value.description
          || this.state.input}>
            <Icon icon="search" color="grey"/>
          </Input>
        {this.renderResults()}
      </div>
    )
  }
}