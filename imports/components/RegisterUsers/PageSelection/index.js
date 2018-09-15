import { Meteor } from 'meteor/meteor';
import React from 'react';
import { appStructure } from '/imports/api/appStructure/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default function PageSelection (props) {
  var numberOfColumns = 3;
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
  getRowStyle = (currentIndex) => {
    var maxItemsInARow = 0;
    var rowCount = Math.floor(currentIndex / numberOfColumns);
    var startOfRow = numberOfColumns * rowCount;
    var endOfRow = startOfRow + numberOfColumns;
    var singleItemHeight = 42;
    var titleHeight = 30;

    for (var i = startOfRow; i < endOfRow; i++) {
      if (!appStructure[i]) break;
      if (appStructure[i].pages.length > maxItemsInARow) maxItemsInARow = appStructure[i].pages.length;
    }
    return {height: (titleHeight + maxItemsInARow * singleItemHeight) + "px"};
  }

  var renderArray = () => {
    var maxItemsInAGroup = 0;
    return appStructure.map((group, i) => {
      const renderPages = (pages) => {
        return pages.map((page, j) => {
          return <Input
                  key={j}
                  type="checkbox"
                  id={"page--" + j + "-" + i}
                  name={page.name}
                  className="register-users__selection-block__checkbox"
                  title={page.title}
                  value={props.item.pages.includes(page.name)}
                  onChange={onChange}/>
        })
      }
      return (
        <div key={i} className="page-selection__page-group" style={getRowStyle(i)}>
          <h3>{group.groupTitle}</h3>
          {renderPages(group.pages)}
        </div>
      )
    })
  }
  return (
    <div className="register-users__selection-block">
      <h4 className="register-users__selection-block__title">Permissões do Usuário:</h4>
      <Block columns={numberOfColumns}>
        {renderArray()}
      </Block>
    </div>
  )
}