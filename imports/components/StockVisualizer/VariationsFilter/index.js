import React from 'react';

import Box from '/imports/components/Box/index';

export default class VariationsFilter extends React.Component {
  render() {
    if (!this.props.variations) {
      return (
        <div>VARIATIONS FILTER (HIDDEN!!)</div>
      )
    } else {
      return (
        <div>VARIATIONS FILTER</div>
      )
    }
  }
}