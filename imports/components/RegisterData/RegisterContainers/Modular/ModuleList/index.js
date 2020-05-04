import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

import FilterBar from '/imports/components/FilterBar/index';
import Input from '/imports/components/Input/index';

class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: '',
      allSelected: false
    }
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  }

  onChange = (e) => {
    var value = e.target.value;
    var _id = e.target.name;
    var allSelected;
    var allowedModules;

    if (_id === "allSelected") {
      allSelected = value;
      if (value) {
        allowedModules = this.props.database.filter((item) => {
          return tools.findSubstring(
            this.state.filterTerm, item.description
          )
        })
      } else allowedModules = [];
    } else {
      allSelected = false;
      allowedModules = [...this.props.item.allowedModules];
      if (value) {
        if (!allowedModules.find((item) => {
          return item._id === _id;
        })) {
          var item = this.props.database.find((item) => {
            return item._id === _id;
          })
          allowedModules.push(item);
        }
      } else {
        for (var i = 0; i < allowedModules.length; i++) {
          if (allowedModules[i]._id === _id) {
            allowedModules.splice(i, 1);
            break;
          }
        }
      }
    }
    var exportValue = {target:
      {value: allowedModules, name: "allowedModules"}
    };
    this.setState({ allSelected }, () => {
      this.props.onChange(exportValue);
    });
  }

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        return tools.findSubstring(
          this.state.filterTerm, item.description
        )
      })
      .map((item, i) => {
        return (
          <tr key={i}>
            <td className="table__wide">
              {item.description}
            </td>
            <td>
              <Input
                key={i}
                type="checkbox"
                id={"module--" + i}
                name={item._id}
                className="register-containers__module-block__checkbox"
                value={!!this.props.item.allowedModules.find((module) => {
                  return module._id === item._id;
                })}
                onChange={this.onChange}/>
            </td>
          </tr>
        )
      })
  }

  render () {
    return (
      <div>
        <h4>Componentes Permitidos:</h4>
        <FilterBar
          value={this.state.filterTerm}
          onChange={this.updateFilter}/>
        <div className="register-containers__module-list">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Descrição</th>
                <th>
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
      </div>
    )
  }
}

export default ModuleListWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var database = Modules.find().fetch() || [];
  return {
    database
  }
})(ModuleList);