import React from 'react';

export default function Loading (props) {
  if (props.fullPage !== false) {
    return (
      <div className="center__background">
        <div className="loading"></div>
      </div>
    )
  } else return <div className="loading"></div>
}