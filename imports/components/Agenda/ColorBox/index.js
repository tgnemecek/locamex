import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Icon from '/imports/components/Icon/index';

export default function ColorBox(props) {
  return (
    <div className="agenda__color-box"
      style={{background: props.color || "black"}}/>
  )
}