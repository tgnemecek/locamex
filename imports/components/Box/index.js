import React from 'react';
import ReactModal from 'react-modal';

export default class Box extends React.Component {
  closeBox = () => {
    this.props.closeBox();
  }
  render() {
    var className = this.props.className ? "box " + this.props.className : "box";
    var style = {
      content: {
        height: this.props.height ? this.props.height : "auto",
        width: this.props.width ? this.props.width : "auto"
      }
    }
    return (
      <ReactModal
        isOpen={true}
        contentLabel={this.props.title || "Box"}
        appElement={document.body}
        onRequestClose={this.closeBox}
        style={style}
        overlayClassName="box-overlay"
        className={className}>
          {this.props.closeBox ? <button onClick={this.closeBox} className="box__close-button">✖</button> : null}
          <div className="box__header">
            <h3>{this.props.title}</h3>
          </div>
          {this.props.children}
      </ReactModal>
    )
  }
}