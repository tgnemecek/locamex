import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function ModulesTable (props) {
  var numberOfRows = 6;
  var numberOfColumns = Math.floor(props.item.modules.length / numberOfRows);
  var renderBody = (index) => {
    return props.item.modules.map((module, i) => {
      if (i >= index && i < (index + numberOfRows)) return (
        <tr key={i}>
          <td>{module.description}</td>
          <td style={{textAlign: "center"}}>{module.renting}</td>
        </tr>
      )
    })
  }
  renderTables = () => {
    var allTables = [];
    for (var i = 0; i < props.item.modules.length; i = i + numberOfRows) {
      allTables = allTables.concat(
        <table key={i} className="table">
          <tbody>
            {renderBody(i)}
          </tbody>
        </table>
      )
    }
    return allTables;
  }
  return (
    <div className="register-packs__module-block">
      <h4 className="register-containers__module-block__title">Componentes do Pacote:</h4>
      <Block columns={numberOfColumns}>
        {renderTables()}
      </Block>
    </div>
  )
}