import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import Available from './Available/index';
import Rented from './Rented/index';

export default class Fixed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitToVisualize: false
    }
  }

  toggleImageWindow = (unit) => {
    var unitToVisualize = this.state.unitToVisualize;
    if (!unitToVisualize) {
      unit.type = 'fixed';
      unit.parentId = this.props.item._id;
      unit.parentDescription = this.props.item.description;
      this.setState({ unitToVisualize: unit });
    } else this.setState({ unitToVisualize: false });
  }

  render() {
    return (
      <div>
        <Available {...this.props} toggleImageWindow={this.toggleImageWindow}/>
        <Rented {...this.props} toggleImageWindow={this.toggleImageWindow}/>
        {this.state.unitToVisualize ?
          <ImageVisualizer
            item={this.state.unitToVisualize}
            toggleWindow={this.toggleImageWindow}/>
        : null}
      </div>
    )
  }
}