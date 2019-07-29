import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import ImageUploader from './ImageUploader/index';

export default class SnapshotVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snapshots: this.props.item.snapshots || [],
      lastRegistry: this.props.item.snapshots.length ? this.props.item.snapshots[this.props.item.snapshots.length-1] : {},
      currentIndex: 0,

      uploadWindow: false,
      confirmationWindow: false
    }
    this.state.maxIndex = this.state.lastRegistry.images ? this.state.lastRegistry.images.length-1 : 0;
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
      <Box
        title="Visualizador de Imagens"
        className="image-visualizer"
        closeBox={this.props.toggleWindow}>
        {this.props.item.type === 'series' ? this.props.item._id : this.props.item.description}
        <div className="image-visualizer__date">
          {this.state.lastRegistry.date ? <p>Fotos enviadas dia: {moment(this.state.lastRegistry.date).format('DD-MM-YYYY')}</p> : null}
        </div>
        <div className="image-visualizer__image-wrap">
          {this.state.snapshots.length ?
            <img
              src={this.state.lastRegistry.images[this.state.currentIndex]}/>
          : null}
        </div>
        <div className="image-visualizer__controls-wrap">
          <button onClick={this.indexDown}>◀</button> {this.state.currentIndex+1} de {this.state.maxIndex+1} <button onClick={this.indexUp}>▶</button>
        </div>
        {this.props.readOnly ? null :
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Novo Registro", className: "button--green", onClick: () => this.toggleUploadWindow()}
          ]}/>
        }
        {this.state.uploadWindow ?
          <ImageUploader
            item={this.props.item}
            toggleWindow={this.toggleUploadWindow}
            closeParent={this.props.toggleWindow}
          />
        : null}
      </Box>
    )
  }
}