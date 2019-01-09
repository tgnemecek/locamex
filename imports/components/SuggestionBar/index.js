import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';

export default class SuggestionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonMode: false,
      query: '',
      results: []
    }
  }

  hideDropbox = () => {
    var results = [];
    this.setState({ results });
  }

  getResults = () => {
    var database = this.props.database || [];
    var query = this.state.query;
    var key = this.props.key || "description";
    var results = [];

    function compareValues(input, value) {
      input = input.toString();
      value = value.toString();

      input = tools.removeSpecialChars(input, /[\.\/\-\(\) ]/g).toUpperCase();
      value = tools.removeSpecialChars(value, /[\.\/\-\(\) ]/g).toUpperCase();

      return input.search(value) !== -1 ? true : false;
    }

    database.forEach((item) => {
      if (compareValues(item[key], query)) {
        results.push(item);
      }
    })
    this.setState({ results });
  }

  renderResults = () => {
    var results = this.state.results;

    if (results.length > 5) results.splice(5);

    return results.map((item, i) => {

      const onClick = (e) => {
        this.props.onClick(e);

        this.setState({ query: item.description, buttonMode: true }, () => {
          this.hideDropbox();
        })
      }

      return <button key={i} name={this.props.name} onClick={onClick} value={item._id}>{item.description}</button>
    })
  }

  onBlur = (e) => {
    var currentTarget = e.currentTarget;
    const hideDropbox = this.hideDropbox;
    setTimeout(function() {
      if (!currentTarget.contains(document.activeElement)) {
        hideDropbox();
      }
    }, 0);
  }

  buttonClick = () => {
    var buttonMode = this.state.buttonMode;
    if (!buttonMode) return;

    this.setState({ buttonMode: false, query: '' });
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
      <div className="suggestion-bar" onBlur={this.onBlur}>
        <Input
          title={this.props.title}
          className={this.state.buttonMode ? "suggestion-bar__input--button" : ""}
          type="text"
          style={this.props.style}
          onChange={this.onChange}
          buttonClick={this.buttonClick}
          value={this.state.query}/>
        {this.state.results.length > 0 ?
          <div className="suggestion-bar__dropbox">
            {this.renderResults()}
          </div>
        : null}

      </div>

    )
  }
}