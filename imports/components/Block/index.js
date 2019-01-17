import React from 'react';
import tools from '/imports/startup/tools/index';

export default class Block extends React.Component {

  renderBlocks = () => {
    // Initial return condition
    if (!this.props.children) return null;
    var options = this.props.options;
    var className = "block";
    // If there's only one child, React takes it off the array, this is to fix that
    if (!Array.isArray(this.props.children)) {
      var style = {width: "100%"};
      return <div className={className} style={style}>{this.props.children}</div>;
    }
    // If this.props.children's last row is incomplete, adds new empty elements
    var children = this.props.children;
    if (this.props.populateChildren) children = populateChildren(this.props.children, this.props.columns, this.props.options);
    function populateChildren(children, columns, options) {
      if (children.length % columns === 0 && !options) return children;

      var newChildren = [];
      var floor = Math.floor(children / columns);
      var lastRowFilled = children - (floor * columns);
      var spacesToBeFilled = columns - lastRowFilled;

      // This is to consider the case where there are less children than columns
      if (children.length < columns) spacesToBeFilled = columns - children;

      var emptyRow = <div></div>;

      for (var i = 0; i < spacesToBeFilled; i++) {
        newChildren.push(emptyRow);
      }
      return children.concat(newChildren);
    }

    // Main function
    return children.map((child, i, array) => {

      // function definePaddings(i, columns) {
        // This almost works, the problem is that I need to consider the span element in options
        // // Initial filter if there's just one column
        // if (columns === 1) return "5px 0";
        // // Defining each style string to be returned
        // var index = i + 1;
        // var leftColumn = "5px 5px 5px 0";
        // var middleColumns = "5px";
        // var rightColumn = "5px 0 5px 5px";
        // // Condition for the first item
        // if (index === 1) return leftColumn;
        // // If multiple, it's rightColumn, if one index before was, it's leftColumn, else it's middleColumns
        // if (index % columns === 0) {
        //   return rightColumn;
        // } else if ((index - 1) % columns === 0) {
        //   return leftColumn;
        // } else return middleColumns;
      // }

      var style = {width: (1 / this.props.columns * 100) + "%"};
      if (options) {
        for (var j = 0; j < options.length; j++) {
          if (options[j].block === i) {
            style = {width: (1 / this.props.columns * 100 * options[j].span) + "%"}
            if (options[j].style) style = {...style, ...options[j].style};
            if (options[j].className) className = className + " " + options[j].className;
          }
        }
      }
      return <div key={i} className={className} style={style}>{child}</div>
    })
  }

  render () {
    return (
      <div className={"block__parent " + this.props.className} style={this.props.style}>
        {this.props.title ? <h4>{this.props.title}</h4> : null}
        {this.renderBlocks()}
      </div>
    )
  }
}