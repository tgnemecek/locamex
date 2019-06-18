import React from 'react';

export default function Loading (props) {
  if (props.fullPage) {
    return (
      <div className="loading__background">
        <div className="loading--full-page"></div>
      </div>
    )
  } else return <div className="loading--small"></div>
}

