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
      modulesDatabaseFiltered: []
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
    var allowedModules = [...this.props.item.allowedModules];
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
        columns={1}
        className="register-containers__module-block">
        <SearchBar
          database={this.props.modulesDatabase}
          searchHere={['description']}
          filterSearch={this.filterSearch}
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