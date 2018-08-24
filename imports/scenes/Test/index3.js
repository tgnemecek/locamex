import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients';

export default class Test3 extends React.Component {

  renderBlocks = () => {
    var options;
    return this.props.children.map((child, i, array) => {
      var style = {width: (1 / this.props.columns * 100) + "%"}
      if (options) {
        for (var j = 0; j < options.length; j++) {
          if (options[j].block === i) {
            style = {width: (1 / this.props.columns * 100 * options[j].span) + "%"}
          }
        }
      }
      return <div key={i} className={this.className} style={style}>{child}</div>
    })
  }

  render() {
    return (
      <div>
        {this.renderBlocks()}
      </div>
    )
  }
}
