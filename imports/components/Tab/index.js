import React from 'react';

export default class Tab extends React.Component {
  renderTabs = () => {
    return this.props.children.map((tab, i) => {
      return <button key={i} className="tab" value={i} onClick={this.props.onClick}>{tab}</button>
    })
  }
  render() {
    return (
      <div className="tab__parent">
        {this.renderTabs()}
      </div>
    )
  }
}