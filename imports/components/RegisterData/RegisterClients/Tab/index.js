import React from 'react';

export default function Tab (props) {
  renderTabs = () => {
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      var value = e.target.value;
      props.changeTab(value);
    }
    return props.tabArray.map((tab, i) => {
      var className = "tab";
      if (props.tab == tab.value) className = "tab active"
      return <button
                key={i}
                className={className}
                style={tab.style}
                value={tab.value}
                onClick={onClick}>{tab.title}</button>
    })
  }
  return (
    <div className="tab__parent">
      {renderTabs()}
    </div>
  )
}