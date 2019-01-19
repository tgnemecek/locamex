import { Meteor } from 'meteor/meteor';
import React from 'react';

import Quantitative from './Quantitative/index';
import Unique from './Unique/index';

export default function Transaction (props) {
  isQuantitative = () => {
    var item = props.item;
    if (item.type === "accessory" || item.type === "module") {
      return true;
    } else return false;
  }

  if (isQuantitative()) {
    return <Quantitative {...props}/>
  } else {
    return <Unique {...props}/>
  }
}