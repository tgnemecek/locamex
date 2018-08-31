import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function PageSelection (props) {
  var numberOfRows = 4;
  var onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    var allowedpages = tools.deepCopy(props.item.pages);
    (() => {
      if (value === true) {
        if (allowedpages.includes(key)) return
        else {
          allowedpages.push(key);
          return;
        }
      } else if (value === false) {
        if (!allowedpages.includes(key)) return;
        else {
          for (var i = 0; i < allowedpages.length; i++) {
            if (allowedpages[i] == key) {
              allowedpages.splice(i, 1);
              break;
            }
          }
        }
      }
    })();
    var exportValue = {target: {value: allowedpages, name: "pages"}};
    props.onChange(exportValue);
  }

  var renderArray = () => {
    return props.pagesDatabase.map((page, i) => {
      return <Input
              key={i}
              type="checkbox"
              id={"page--" + i}
              name={page._id}
              className="register-users__selection-block__checkbox"
              title={page.description}
              value={props.item.pages.includes(page._id)}
              onChange={onChange}/>
    })
  }
  return (
    <div className="register-users__selection-block">
      <h4 className="register-users__selection-block__title">Permissões do Usuário:</h4>
      <Block columns={Math.floor(props.pagesDatabase.length / numberOfRows)}>
        {renderArray()}
      </Block>
    </div>
  )
}