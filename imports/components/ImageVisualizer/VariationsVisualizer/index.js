import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';
import Input from '/imports/components/Input/index';

export default class VariationsVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.item.images || [],
      currentIndex: 0,
      maxIndex: this.props.item.images ? this.props.item.images.length-1 : 0,

      uploadWindow: false,
      confirmationWindow: false
    }
  }
  toggleUploadWindow = (fullClose) => {
    if (fullClose) {
      this.props.toggleWindow();
    } else {
      var uploadWindow = !this.state.uploadWindow;
      this.setState({ uploadWindow })
    }
  }
  indexUp = () => {
    var currentIndex = this.state.currentIndex;
    var nextIndex = currentIndex+1;

    if (nextIndex > this.state.maxIndex) nextIndex = 0;
    this.setState({ currentIndex: nextIndex })
  }
  indexDown = () => {
    var currentIndex = this.state.currentIndex;
    var nextIndex = currentIndex-1;

    if (nextIndex < 0) nextIndex = this.state.maxIndex;
    this.setState({ currentIndex: nextIndex })
  }
  render() {
    return (
      <div>
        <div className="image-visualizer__image-wrap">
          {this.state.images.length ?
            <img
              src={this.state.images[this.state.currentIndex]}/>
          : null}
        </div>
        <div className="image-visualizer__controls-wrap">
          <button onClick={this.indexDown}>
            ◀
          </button>
          {this.state.currentIndex+1} de {this.state.maxIndex+1}
          <button onClick={this.indexUp}>
            ▶
          </button>
        </div>
      </div>
    )
  }
}