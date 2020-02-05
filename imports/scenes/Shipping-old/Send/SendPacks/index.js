import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

import ModuleList from './ModuleList/index';

export default class SendPacks extends React.Component {
  renderHeader = () => {
    return (
      <tr>
        <th className="table__small-column">#</th>
        <th>Produto</th>
        <th className="table__small-column">
          Componentes
        </th>
      </tr>
    )
  }

  renderBody = () => {
    function checkmark(item) {
      if (!item.modules.length) {
        return <span style={{color: 'red'}}>⦸</span>;
      } else {
        return <span style={{color: 'green'}}>✔</span>
      }
    }

    return this.props.packs.map((item, i) => {
      const updateModules = (newModules) => {
        var packs = tools.deepCopy(this.props.packs);
        packs[i].modules = newModules;
        this.props.onChange({ packs });
      }
      return (
        <tr key={i}>
          <td className="table__small-column">
            {item.label}
          </td>
          <td>
            {item.description}
          </td>
          <td>
            <ModuleList
              modules={item.modules}
              modulesDatabase={this.props.modulesDatabase}
              placesDatabase={this.props.placesDatabase}
              allowedModules={item.allowedModules}
              updateModules={updateModules}/>
          </td>
          <td className="table__small-column">
            {item.modules.find((module) => {
                return module.selected.find((select) => {
                  return select.selected > 0;
                })
              })
            ?
              <span style={{color: 'green'}}>✔</span>
            :
              <span style={{color: 'red'}}>⦸</span>}
          </td>
        </tr>
      )
    });
  }

  render() {
    return (
      <div>
        <h4>Containers Modulares</h4>
        <table className="table">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
    )
  }
}