import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

import SearchBar from '/imports/components/SearchBar/index';
import Input from '/imports/components/Input/index';
import RegisterModules from '/imports/components/RegisterModules/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulesDatabaseFiltered: this.props.modulesDatabase
    }
  }
  searchReturn = (modulesDatabaseFiltered) => {
    if (modulesDatabaseFiltered) {
      this.setState({ modulesDatabaseFiltered });
    } else this.setState({ modulesDatabaseFiltered: this.props.modulesDatabase });
  }
  onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    var allowedModules = tools.deepCopy(this.props.item.allowedModules);
    (() => {
      if (value === true) {
        if (allowedModules.includes(key)) return
        else {
          allowedModules.push(key);
          return;
        }
      } else if (value === false) {
        if (!allowedModules.includes(key)) return;
        else {
          for (var i = 0; i < allowedModules.length; i++) {
            if (allowedModules[i] == key) {
              allowedModules.splice(i, 1);
              break;
            }
          }
        }
      }
    })();
    var exportValue = {target: {value: allowedModules, name: "allowedModules"}};
    this.props.onChange(exportValue);
  }

  renderBody = () => {
    return this.props.modulesDatabase.map((item, i) => {
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
      <div className="register-containers__module-block">
        <h4 className="register-containers__module-block__title">Componentes Permitidos:</h4>
        <SearchBar
          database={this.props.modulesDatabase}
          options={this.props.searchOptions}
          searchReturn={this.searchReturn}
        />
        <table className="table database__table">
          <thead>
            <tr>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
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