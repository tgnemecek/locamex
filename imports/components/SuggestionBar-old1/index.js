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
      input: '',
      result: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && prevProps.database) {
      if (prevProps.database.length === 0) {
        var result = this.props.database.find((item) => {
          return item._id === this.props.value;
        })
        if (result) {
          var input = result.description;
          this.setState({ result, input });
        }
      }
    }
  }

  renderResults = () => {
    const getResults = () => {
      if (this.props.showAll && !this.state.result) return database;
      if (this.state.result) return [];

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
            var result = item;
            this.props.onClick({target: {
              value: result._id,
              name: this.props.name
            }}, result);

            this.setState({
              input: result.description,
              result: result,
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
        })}
      </ul>
    )
  }

  onChange = (e) => {
    this.setState({ input: e.target.value });
  }

  buttonClick = () => {
    this.setState({ input: '', result: '' }, () => {
      this.props.onClick({target: {value: '', name: this.props.name}}, {});
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
          value={this.state.input}/>
        {this.renderResults()}
      </div>
    )
  }
}