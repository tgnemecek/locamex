import React from 'react';

export default class Tab extends React.Component {
  renderTabs = () => {
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      var value = e.target.value;
      this.props.changeTab(value);
    }
    return this.props.tabArray.map((tab, i) => {
      var className = "tab";
      if (this.props.tab == tab.value) className = "tab active"
      return <button key={i} className={className} value={tab.value} onClick={onClick}>{tab.title}</button>
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