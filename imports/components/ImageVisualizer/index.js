import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import FileUploader from './FileUploader/index';
import SeriesVisualizer from './SeriesVisualizer/index';
import VariationsVisualizer from './VariationsVisualizer/index';

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
  subtitle = () => {
    var result = "";
    if (this.props.item.type === 'series') {
      result = this.props.item.container.description;
      result += " - Série: " + this.props.item.description;
    } else {
      result = this.props.item.description;
    }
    return result;
  }
  render() {
    return (
      <Box
        title="Visualizador de Imagens"
        subtitle={this.subtitle()}
        className="image-visualizer"
        closeBox={this.props.toggleWindow}
        >
        {this.props.item.type === "series" ?
          <SeriesVisualizer {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>
        : <VariationsVisualizer {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>}
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Novo Registro", className: "button--green", onClick: this.toggleUploadWindow}
          ]}/>
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