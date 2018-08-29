import React from 'react';

export default class Block extends React.Component {

  renderBlocks = () => {
    var options = this.props.options;
    var className = "block";
    if (!this.props.children) return null;
    if (!Array.isArray(this.props.children)) {
      var style = {width: "100%"};
      return <div className={className} style={style}>{this.props.children}</div>;
    }
    return this.props.children.map((child, i, array) => {
      var style = {width: (1 / this.props.columns * 100) + "%"}
      if (options) {
        for (var j = 0; j < options.length; j++) {
          if (options[j].block === i) {
            style = {width: (1 / this.props.columns * 100 * options[j].span) + "%"}
          }
        }
      }
      return <div key={i} className={className} style={style}>{child}</div>
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