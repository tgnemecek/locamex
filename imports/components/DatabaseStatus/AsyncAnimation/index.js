import React from 'react';

export default class AsyncAnimation extends React.Component {
  constructor(props) {
    super(props);
  }
  className = () => {
    var className = "";
    if (!this.props.size || this.props.size === "regular") {
      className = "async-animation--regular";
    } else if (this.props.size === "small") {
      className = "async-animation--small";
    }
    if (this.props.status === "completed") className += " async-animation--completed";
    if (this.props.status === "failed") className += " async-animation--failed";
    return className;
  }
  checkmark = () => {
    if (this.props.status === "completed") return {display: ""};
    return {display: "none"};
  }
  crossmark = () => {
    if (this.props.status === "failed") return {display: ""};
    return {display: "none"};
  }

  render() {
    return (
      <div className={this.className()}>
        <div style={this.checkmark()} className="async-animation__checkmark async-animation__draw"></div>
        <div style={this.crossmark()} className="async-animation__crossmark async-animation__draw"></div>
      </div>
    )
  }
}