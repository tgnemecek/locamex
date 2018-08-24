import React from 'react';
import ReactModal from 'react-modal';

export default class Box extends React.Component {
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
        contentLabel="Box"
        appElement={document.body}
        onRequestClose={this.props.closeBox}
        style={style}
        overlayClassName="box-overlay"
        className={className}>
          {this.props.closeBox ? <button onClick={this.props.closeBox} className="button--close-box">✖</button> : null}
          <div className="box__header">
            <h3>{this.props.title}</h3>
          </div>
          {this.props.children}
      </ReactModal>
    )
  }
}