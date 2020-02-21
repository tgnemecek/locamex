import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import FileUploader from '/imports/components/FileUploader/index';

import SeriesVisualizer from './SeriesVisualizer/index';
import VariationsVisualizer from './VariationsVisualizer/index';

export default class ImageVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadWindow: false,
      databaseStatus: '',
      variationToUpload: 0
    }
  }
  changeVariationToUpload = (e) => {
    this.setState({ variationToUpload: e.target.value })
  }
  toggleUploadWindow = () => {
    var uploadWindow = !this.state.uploadWindow;
    this.setState({ uploadWindow });
  }
  params = () => {
    if (this.props.item.type === "series") {
      return {
        accept: ".jpg",
        maximum: 10
      }
    } else if (this.props.item.type === "accessory") {
      return {
        accept: ".jpg",
        maximum: 1
      }
    }
  }
  upload = (arrayOfDataUrls, callback) => {
    if (this.props.item.type === "series") {
      Meteor.call('series.update.snapshots',
      this.props.item._id, arrayOfDataUrls, callback);
    } else if (this.props.item.type === "accessory") {
      Meteor.call('variations.update.image',
      this.props.variations[this.state.variationToUpload]._id,
      arrayOfDataUrls[0], callback);
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
          <SeriesVisualizer
            {...this.props}
            item={{
              ...this.props.item,
              snapshots: [...this.props.item.snapshots].reverse()
            }}
            toggleUploadWindow={this.toggleUploadWindow}/>
        : <VariationsVisualizer {...this.props}
            toggleUploadWindow={this.toggleUploadWindow}/>}
          <FooterButtons
            disabled={!tools.isWriteAllowed(this.props.item.type)}
            buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Novo Upload", className: "button--green", onClick: this.toggleUploadWindow}
          ]}/>
        {this.state.uploadWindow ?
          <FileUploader {...this.props}
            toggleWindow={this.toggleUploadWindow}
            upload={this.upload}
            {...this.params()}
          >
            {this.props.item.type === 'accessory' ?
              <Input
                type="select"
                value={this.state.variationToUpload}
                onChange={this.changeVariationToUpload}
                >
                {this.props.variations.map((variation, i) => {
                  return (
                    <option key={i} value={i}>
                      {variation.description}
                    </option>
                  )
                })}
              </Input>
            : null}
          </FileUploader>
        : null}
      </Box>
    )
  }
}