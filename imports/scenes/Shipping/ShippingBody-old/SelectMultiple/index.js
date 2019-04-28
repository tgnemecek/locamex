import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import WithoutVariations from './WithoutVariations/index';
// import WithVariations from './WithVariations/index';
// import PlacesDistribution from './PlacesDistribution/index';
// import SelectedList from './SelectedList/index';
// import Footer from './Footer/index';

export default function SelectMultiple(props) {
  var joined = {
    onChange: props.onChange
  }
  // if (props.item.variations) {
    // return <WithVariations {...joined} />
  // } else return <WithoutVariations {...joined} />
}