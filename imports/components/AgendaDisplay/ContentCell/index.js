import React from 'react';
import tools from '/imports/startup/tools/index';

import Button from '/imports/components/Button/index';

export default class ContentCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWindowOpen: false,
      x: null,
      y: null
    }
  }

  onMouseEnter = (e) => {
    var x = e.clientX;
    var y = e.clientY;
    this.setState({ isWindowOpen: true, x, y });
  }

  onMouseLeave = (e) => {
    this.setState({ isWindowOpen: false });
  }

  render() {
    return (
      <td className={this.props.className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Button icon="star" className="agenda__star" iconStyle={{color: "black"}}/>
        {this.props.date.format("DD")}
        <HoverWindow
          isWindowOpen={this.state.isWindowOpen}
          x={this.state.x}
          y={this.state.y}
          events={this.props.events}
        />
      </td>
    )
  }
}

function HoverWindow(props) {
  if (!props.isWindowOpen) return null;

  renderEvents = () => {
    return props.events.map((event, i) => {
      return <span key={i}>aaa</span>
    })
  }

  style = () => {
    return {transform: `translate3d(${props.x}px, ${props.y}.px, 0px)`};
  }


  return (
    <div className="agenda__hoverbox" style={style()}>
      {renderEvents()}
    </div>
  )
}