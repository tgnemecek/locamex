import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Selector from './Selector/index';
import FileUploader from './FileUploader/index';
// import WithoutSnapshots from './WithoutSnapshots/index';
// import WithSnapshots from './WithSnapshots/index';

export default class ImageVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entryIndex: 0,
      imageIndex: 0,
      databaseStatus: false,
      uploadWindow: false
    }
  }
  toggleUploadWindow = () => {
    var uploadWindow = !this.state.uploadWindow;
    this.setState({ uploadWindow });
  }
  setEntryIndex = () => {
    
  }
  params = () => {
    var general = {
      allowedFileTypes: ["image/jpeg"],
      maximum: 10
    }

    var code = new Date().getTime();
    var date = moment().format("YYYY-MM-DD") + "_" + code;

    if (this.props.item.type === "series") {
      return {
        ...general,
        filePath: `user-uploads/snapshots/series/${this.props.item._id}/${date}/`,
        fileName: `ss-series-${this.props.item._id}-${code}`
      }
    } else {
      return {
        ...general,
        filePath: `user-uploads/images/${this.props.item.type}/${this.props.item._id}/`,
        fileName: `img-${this.props.item.type}-${this.props.item._id}`
      }
    }
  }
  renderImage = () => {
    if (!this.props.entries.length) return null;
    var entry = this.props.entries[this.state.entryIndex];
    var image = entry[this.state.imageIndex];
    if (image) {
      return <img src={image}/>
    } else return null;
  }
  render() {
    return (
      <Box
        title="Visualizador de Imagens"
        subtitle={this.props.item.description}
        className="image-visualizer"
        >
          <Selector
            setEntryIndex={this.setEntryIndex}
            entryIndex={this.state.entryIndex}
            entries={this.props.entries}/>
          <div className="image-visualizer__image-wrap">
            {this.renderImage()}
          </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Novo Upload", className: "button--green", onClick: this.toggleUploadWindow}
          ]}/>
        {/* {this.props.item.type === "series" ?
          <WithSnapshots {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>
        : <WithoutSnapshots {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>} */}
        {this.state.uploadWindow ?
          <FileUploader {...this.props}
            toggleWindow={this.toggleUploadWindow}
            closeParent={this.props.toggleWindow}
            toggleUploadWindow={this.toggleUploadWindow}
            params={this.params()}
          />
        : null}
      </Box>
    )
  }
}