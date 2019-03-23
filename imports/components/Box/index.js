import React from 'react';
import ReactModal from 'react-modal';

export default class Box extends React.Component {
  closeBox = () => {
    this.props.closeBox();
  }
  className = () => {
    return this.props.className ? "box " + this.props.className : "box";
  }
  style = () => {
    return {
      content: {
        height: this.props.height ? this.props.height : "auto",
        width: this.props.width ? this.props.width : "auto",
        ...this.props.style
      }
    };
  }
  render() {
    return (
      <ReactModal
        isOpen={true}
        id={this.props.id}
        contentLabel={this.props.title || "Box"}
        appElement={document.body}
        onRequestClose={this.closeBox}
        style={this.style()}
        overlayClassName="box-overlay"
        className={this.className()}>
          {this.props.closeBox ? <button onClick={this.closeBox} className="box__close-button">✖</button> : null}
          <div className="box__header">
            <h3>{this.props.title}</h3>
          </div>
          {this.props.children}
      </ReactModal>
    )
  }
}