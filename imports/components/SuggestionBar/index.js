import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
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

  componentDidMount() {
    if (this.props.value) {
      this.props.database.forEach((item) => {
        if (item._id === this.props.value) {
          this.props.onClick({target: {value: item._id, name: this.props.name}});
          this.setState({ query: item.description, buttonMode: true })
        }
      })
    }
  }

  hideDropbox = () => {
    this.setState({ results: [] });
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
    const onClick = (e) => {
      var exportObject = this.state.results[e.target.name] || {};
      this.props.onClick({target: {
        value: e.target.value,
        name: this.props.name
      }}, exportObject);

      this.setState({ query: exportObject.description, buttonMode: true }, () => {
        this.hideDropbox();
      })
    }
    return this.state.results.map((item, i) => {
      return <li key={i}><button name={i} onClick={onClick} value={item._id}>{item.description}</button></li>
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
  }

  buttonClick = () => {
    var buttonMode = this.state.buttonMode;
    if (!buttonMode) return;

    this.setState({ buttonMode: false, query: '' }, () => {
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
      <div className="suggestion-bar" onBlur={this.onBlur} onFocus={this.conditionalShowAll}>
        <div className="suggestion-bar__magnifier" style={this.props.title ? {top: "2.5rem"} : {top: "1rem"}}>
          <Button icon="search" />
        </div>
        <Input
          title={this.props.title}
          className={this.state.buttonMode ? "suggestion-bar__input--button" : ""}
          type="text"
          style={this.props.style}
          onChange={this.onChange}
          buttonClick={this.buttonClick}
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