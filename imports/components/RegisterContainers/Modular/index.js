import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function Modular (props) {
  var modulesDatabase = tools.deepCopy(props.item.modulesDatabase);
  var numberOfColumns = 4;
  var renderArray = () => {
    return modulesDatabase.map((module, i) => {
      const onChange = (e) => {
        modulesDatabase[i] = e.target.value;
        var exportValue = {target: {value: modulesDatabase, name: "modules"}};
        props.onChange(exportValue);
      }
      return <Input
              key={i}
              type="checkbox"
              id={"module--" + i}
              className="register-containers__module-checkbox"
              title={module.description}
              value={props.item.modules.includes(module._id)}
              onChange={onChange}/>
    })
  }
  return (
    <div className="register-containers__module-block">
      <h4 className="register-containers__transaction__title">Componentes Permitidos:</h4>
      <Block columns={Math.floor(modulesDatabase.length / numberOfColumns)}>
        {renderArray()}
      </Block>
    </div>
  )
}