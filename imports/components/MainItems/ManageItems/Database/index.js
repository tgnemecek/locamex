import { Meteor } from 'meteor/meteor';
import React from 'react';
import Icon from '/imports/components/Icon/index';
import tools from '/imports/startup/tools/index';

export default class Database extends React.Component {
  render() {
      return (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Descrição</th>
              </tr>
            </thead>
            <tbody>
            {this.props.database.map((item, i, array) => {
                return (
                  <tr key={i}>
                    <td className="table__wide">
                      {item.description}
                    </td>
                    <td className="no-padding">
                      <button
                        onClick={() => this.props.addItem(item)}>
                        <Icon icon="arrowRight"/>
                      </button>
                    </td>
                  </tr>
                )
            })}
            </tbody>
          </table>
        </div>
      )
  }
}