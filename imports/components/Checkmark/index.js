import React from 'react';

export default function Checkmark(props) {
//Component not used yet, for future implementation
  if (props.status == "saving") {
    return (
      <div className="circle-loader">
        <div className="checkmark draw"></div>
      </div>
    )
  } else if (props.status == "saved") {
    return (
      <div className="circle-loader load-complete">
        <div className="checkmark draw"></div>
      </div>
    )
  } else if (props.status == "idle") {
    return null;
  }
}