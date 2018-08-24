import React from 'react';

export default class Block extends React.Component {
  constructor(props) {
    super(props);
    this.divisions = this.props.children.length || 1;
    this.className = "block";
  }

  renderBlocks = () => {
    var options = this.props.options;
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

  render () {
    return (
      <div className={"block__parent " + this.props.className}>
        {this.renderBlocks()}
      </div>
    )
  }
}