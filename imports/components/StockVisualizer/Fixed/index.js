import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import Available from './Available/index';
import Rented from './Rented/index';

export default class Fixed extends React.Component {

  filterAvailable = () => {
    var item = {...this.props.item};
    item.units = item.units.filter((item) => {
      if (item.visible && item.place !== 'rented') return true;
    })
    return item;
  }

  filterRented = () => {
    var item = {...this.props.item};
    item.units = item.units.filter((item) => {
      if (item.visible && item.place === 'rented') return true;
    })
    return item;
  }


  render() {
    return (
      <div>
        <Available {...this.props} item={this.filterAvailable()} />
        <Rented {...this.props} item={this.filterRented()} />
      </div>
    )
  }
}