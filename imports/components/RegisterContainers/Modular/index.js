import React from 'react';
import { Modules } from '/imports/api/modules/index';

import tools from '/imports/startup/tools/index';
import SearchBar from '/imports/components/SearchBar/index';

import Input from '/imports/components/Input/index';
import RegisterModules from '/imports/components/RegisterModules/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class Modular extends React.Component {
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
    var exportValue = {target: {value: allowedModules, name: "modules"}};
    this.props.onChange(exportValue);
  }

  renderBody = () => {
    return this.props.modulesDatabase.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="small-column">
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
          searchReturn={this.props.searchReturn}
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