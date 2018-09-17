import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function Modular (props) {
  var numberOfRows = 4;
  var onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    var allowedModules = tools.deepCopy(props.item.modules);
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
    props.onChange(exportValue);
  }

  var renderArray = () => {
    return props.modulesDatabase.map((module, i) => {
      return <Input
              key={i}
              type="checkbox"
              id={"module--" + i}
              name={module._id}
              className="register-containers__module__checkbox"
              title={module.description}
              value={props.item.modules.includes(module._id)}
              onChange={onChange}/>
    })
  }
  return (
    <div className="register-containers__module-block">
      <h4 className="register-containers__transaction__title">Componentes Permitidos:</h4>
      <Block columns={Math.floor(props.modulesDatabase.length / numberOfRows)}>
        {renderArray()}
      </Block>
    </div>
  )
}