import React from 'react';
import ReactModal from 'react-modal';

import Help from '/imports/components/Help/index';
import Icon from '/imports/components/Icon/index';

export default class Box extends React.Component {
  closeBox = () => {
    if (this.props.closeBox) {
      this.props.closeBox();
    }
  }
  className = () => {
    return this.props.className ? "box " + this.props.className : "box";
  }
  style = () => {
    return {};
    // return {
    //   content: {
    //     height: this.props.height || "",
    //     width: this.props.width || "",
    //     ...this.props.style
    //   }
    // };
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
          {this.props.closeBox ?
            <div className="box__close-button">
              <button onClick={this.closeBox}>
                <Icon icon="not" style={{fontSize: "1.2rem"}}/>
              </button>
            </div>
          : null}
          {this.props.help ?
            <Help
              className="box__help-button"
              help={this.props.help}/>
          : null}
          {this.props.title ?
            <div className="box__header">
              <h3>{this.props.title}</h3>
              {this.props.subtitle ?
                <p className="box__subtitle">
                  {this.props.subtitle}
                </p>
              : null}
            </div>
          : null}
          {this.props.children}
      </ReactModal>
    )
  }
}