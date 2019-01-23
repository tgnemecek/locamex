import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import FileUploader from '/imports/components/FileUploader/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class ImageVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snapshots: this.props.item.snapshots || [],
      lastRegistry: this.props.item.snapshots ? this.props.item.snapshots[this.props.item.snapshots.length-1] : {},
      currentIndex: 0,

      errorMsg: '',
      errorKeys: [],

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
        closeBox={this.props.toggleWindow}>
        <div className="image-visualizer__date">
          {this.state.lastRegistry.date ? <p>Fotos enviadas dia: {moment(this.state.lastRegistry.date).format('DD-MM-YYYY')}</p> : null}
        </div>
        <div className="image-visualizer__image-wrap">
          {this.state.snapshots.length ?
            <img
              width="800px"
              src={this.state.lastRegistry.images[this.state.currentIndex]}/>
          : null}
        </div>
        <div className="image-visualizer__controls-wrap">
          <button onClick={this.indexDown}>◀</button> {this.state.currentIndex+1} de {this.state.maxIndex+1} <button onClick={this.indexUp}>▶</button>
        </div>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Novo Registro", className: "button--green", onClick: () => this.toggleUploadWindow()}
        ]}/>
        {this.state.uploadWindow ?
          <FileUploader
            uploadDirective="imageUploads"
            item={this.props.item}
            toggleWindow={this.toggleUploadWindow}
          />
        : null}
      </Box>
    )
  }
}