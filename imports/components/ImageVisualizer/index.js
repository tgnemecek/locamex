import React from 'react';
import tools from '/imports/startup/tools/index';

import FileUploader from '/imports/components/FileUploader/index';
import WithoutSnapshots from './WithoutSnapshots/index';
import WithSnapshots from './WithSnapshots/index';

export default class ImageVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadWindow: false
    }
  }
  toggleUploadWindow = () => {
    var uploadWindow = !this.state.uploadWindow;
    this.setState({ uploadWindow });
  }
  params = () => {
    var general = {
      allowedFileTypes: ["jpg"],
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
  render() {
    return (
      <>
        {this.props.item.type === "series" ?
          <WithSnapshots {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>
        : <WithoutSnapshots {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>}
        {this.state.uploadWindow ?
          <FileUploader {...this.props}
            toggleWindow={this.toggleUploadWindow}
            closeParent={this.props.toggleWindow}
            toggleUploadWindow={this.toggleUploadWindow}
            params={this.params()}
          />
        : null}
      </>
    )
  }
}