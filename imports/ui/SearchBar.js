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
    if (!this.state.value) {
      this.props.searchReturn(false);
      return;
    }

    var value = makeEqual(this.state.value);
    let clients = this.props.database;
    let result = [];

    function makeEqual(str) {
      return customTypes.removeSpecialChars(str).toUpperCase();
    }

    function compare(keyValue) {
      return makeEqual(keyValue).search(value) === -1 ? false : true;
    }

 //ADICIONEI LABELS PRA DAR 'continue label' ou 'break label', AINDA FALTA UMA LABEL!!!!!
    for (var i = 0; i < clients.length; i++) { //Look for all Clients
      for (var key of Object.keys(clients[i])) { //Look inside the Clients and iterate for each key
        if (Array.isArray(clients[i][key])) {
          console.log('inside object');
          for (var contact in clients[i][key]) {
            console.log('inside foreach');
            for (var info in contact) {
              console.log('inside for in');
              if (compare(contact[info])) {
                result.push(clients[i]);
                break;
              }
            }
            break;
          }
        } else {
          if (key == this.state.option || this.state.option == 'all') {
            compare(clients[i][key]) ? result.push(clients[i]) : null;
          }
        }
        if (result.includes(clients[i])) break;
      }
    }
    this.props.searchReturn(result);
  }
  //
  //       if (this.state.option == 'all') {
  //         if (compare(clients[i][key])) {
  //           result.push(clients[i]);
  //           break;
  //         } else if (key == 'contacts') {
  //                   for (var contact in clients[i].contacts) {
  //                     if (compare(contact[key]) {
  //                       result.push(clients[i]);
  //                       break;
  //                     }
  //                   }
  //                 }
  //       } else if (key == this.state.option) {
  //           if (compare(clients[i][key]) {
  //             result.push(clients[i]);
  //             break;
  //           } else if (key == 'contacts') {
  //                     for (var contact in clients[i].contacts) {
  //                       for (var key in contact) {
  //                         return this.state.option == key ? true : false;
  //                       }
  //                       if (contact) {
  //                         result.push(clients[i]);
  //                         break;
  //                       }
  //                     }
  //                   }
  //       }
  //     }
  //   }
  //
  //   this.props.database.forEach((client) => {
  //     result.includes(client) ?
  //     Object.getOwnPropertyNames(client).forEach((key) => {
  //       if (j == 0) {
  //         if (this.state.option == 'all') {
  //           if (makeEqual(client[key]).search(value) !== -1) {
  //             result.push(client);
  //             j++;
  //           }
  //         } else if (key == this.state.option) {
  //             if (makeEqual(client[key]).search(value) !== -1) {
  //               result.push(client);
  //               j++;
  //             }
  //         }
  //         if (key == 'contacts' && j == 0) {
  //           item.contacts.forEach((contact) => {
  //             if (makeEqual(contact[key]).search(value) !== -1) {
  //               result.push(client);
  //               j++;
  //             }
  //           })
  //         }
  //       }
  //     return true;
  //     })
  //   });
  //   this.props.searchReturn(result);
  // }

  render() {
    return (
      <div className="search-bar">
        <div className="search-bar__block">
          <select value={this.state.option} onChange={this.onSelect}>
            <option value="all">Todos</option>
            {this.renderOptions()}
          </select>
        </div>
        <div className="search-bar__block search-bar__block--main">
          <label>Pesquisa:</label>
          <input value={this.state.value} onChange={this.onChange} type="text"/>
        </div>
        <div className="search-bar__block">
          <button className="button--pill button--search-bar" onClick={this.runSearch}>Buscar</button>
        </div>
      </div>
    )
  }
}