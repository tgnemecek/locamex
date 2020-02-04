import React from 'react';

export default function Select (props) {
  onChange = (e) => {
    if (e) {
      var value = e.target.value;
      props.onChange(value);
    }
  }
  return (
    <select
      value={props.value}
      onChange={onChange}
      style={props.style}
      readOnly={props.readOnly}
      disabled={props.disabled}>
      {props.children}
    </select>
  )
}