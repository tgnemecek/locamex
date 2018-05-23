import React from 'react';

export class ConfirmationMessage extends React.Component {
  render() {
    return(
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0
        ">
        <h3>{this.props.title}</h3>
        <div className="button__main-div">
          <button className="button button--secondary">Não</button>
          <button className="button button--danger">Sim</button>
        </div>
      </div>
    )
  }
}