import React from 'react';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class FlyerCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFlyer: !!this.props.item.flyer,
      paragraphs: this.props.item.flyer ? this.props.item.flyer.paragraphs : [
        '', '', ''
      ],
      images: this.props.item.flyer ? this.props.item.flyer.images : []
    }
  }

  toggleFlyer = () => {
    this.setState({ hasFlyer: !this.state.hasFlyer })
  }

  onChangeParagraph = (e) => {
    function addBulletPoints(input) {
      // Remove all bullet points
      input = input.replace(/•\s*/g, "");
      // Add one for each new line
      input = input.replace(/\n/g, "\n• ");
      // Add one at the start of the string
      input = input.replace(/(^.)/g, "• $1");
      return input;
    }
    var value = addBulletPoints(e.target.value);
    var paragraphs = [...this.state.paragraphs];
    paragraphs[e.target.name] = value;
    this.setState({ paragraphs });
  }

  setImages = (e) => {
    this.setState({ images: e.target.value });
  }

  removeImage = (i) => {
    var images = [...this.state.images];
    images.splice(i, 1);
    this.setState({ images });
  }

  render() {
    return (
      <Box
        className="flyer-creator"
        closeBox={this.props.toggleWindow}
        title={"Folder do Produto: " + this.props.item.description}>
        <div className="flyer-creator__checkbox">
          <Input
            title="Possui Folder"
            type="checkbox"
            id="hasFlyer"
            value={this.state.hasFlyer}
            onChange={this.toggleFlyer}
          />
        </div>
        <div className="flyer-creator__body">
          <Input
            title="Subtítulo"
            type="textarea"
            name={0}
            disabled={!this.state.hasFlyer}
            value={this.state.paragraphs[0]}
            onChange={this.onChangeParagraph}
          />
          <Input
            title="Parágrafo 1"
            type="textarea"
            name={1}
            disabled={!this.state.hasFlyer}
            value={this.state.paragraphs[1]}
            onChange={this.onChangeParagraph}
          />
          <Input
            title="Parágrafo 2"
            type="textarea"
            name={2}
            disabled={!this.state.hasFlyer}
            value={this.state.paragraphs[2]}
            onChange={this.onChangeParagraph}
          />
          <div>
            <Input
              title="Imagens"
              type="file"
              accept="image/*"
              preview={true}
              removeFile={this.removeImage}
              value={this.state.images}
              max={2}
              onChange={this.setImages}/>
          </div>
        </div>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Enviar", onClick: this.saveEdits}
        ]}/>
      </Box>

    )
  }
}