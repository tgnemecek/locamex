import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import SearchBar from '/imports/components/SearchBar/index';
import Input from '/imports/components/Input/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulesDatabaseFiltered: [],
      allSelected: false
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.modulesDatabase.length !== this.props.modulesDatabase.length) {
      this.setState({ modulesDatabaseFiltered: this.props.modulesDatabase });
    }
  }
  filterSearch = (modulesDatabaseFiltered) => {
    this.setState({ modulesDatabaseFiltered });
  }
  onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    var allowedModules;

    if (key === "allSelected") {
      if (value) {
        allowedModules = this.state.modulesDatabaseFiltered.map((item) => {
          return item._id;
        })
      } else {
        allowedModules = [];
      }
      var exportValue = {target: {value: allowedModules, name: "allowedModules"}};
      this.setState({ allSelected: value }, () => {
        this.props.onChange(exportValue);
      });
      return;
    } else {
      allowedModules = [...this.props.item.allowedModules];
      if (value) {
        if (!allowedModules.includes(key)) {
          allowedModules.push(key);
        }
      } else {
        for (var i = 0; i < allowedModules.length; i++) {
          if (allowedModules[i] == key) {
            allowedModules.splice(i, 1);
            break;
          }
        }
      }
      var exportValue = {target: {value: allowedModules, name: "allowedModules"}};
      this.setState({ allSelected: false }, () => {
        this.props.onChange(exportValue);
      });
    }
  }

  renderBody = () => {
    return this.state.modulesDatabaseFiltered.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">
            <Input
              key={i}
              type="checkbox"
              id={"module--" + i}
              name={item._id}
              className="register-containers__module-block__checkbox"
              value={this.props.item.allowedModules.includes(item._id)}
              onChange={this.onChange}/>
          </td>
        </tr>
      )
    })
  }

  render () {
    return (
      <Block
        title="Componentes Permitidos:"
        columns={1}>
        <SearchBar
          database={this.props.modulesDatabase}
          searchHere={['description']}
          filterSearch={this.filterSearch}
        />
        <div className="register-containers__module-list">
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="table__small-column">
                  <Input
                    type="checkbox"
                    id="module--all"
                    name="allSelected"
                    className="register-containers__module-block__checkbox"
                    value={this.state.allSelected}
                    onChange={this.onChange}/>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      </Block>
    )
  }
}

export default ModuleListWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var modulesDatabase = Modules.find().fetch();
  return {
    modulesDatabase
  }
})(ModuleList);