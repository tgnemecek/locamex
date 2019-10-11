import React from 'react';
import { saveAs } from 'file-saver';

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
      newImages: false,
      paragraphs: this.props.item.flyer ? this.props.item.flyer.paragraphs : [
        '', '', ''
      ],
      images: [],
      databaseStatus: false
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: [e.target.value] })
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

  print = () => {
    var data = {
      item: this.props.item,
      type: "flyer"
    }

    Meteor.call('pdf.generate', data, (err, res) => {
      if (res) {
        saveAs(res.data, res.fileName);
        // this.setState({ databaseStatus: "completed" });
      }
      if (err) {
        // this.setState({ databaseStatus: "failed" });
        console.log(err);
      }
    })
  }

  saveEdits = () => {
    var data = {
      hasFlyer: this.state.hasFlyer,
      newImages: this.state.newImages,
      paragraphs: this.state.paragraphs,
      images: this.state.images,
      item: this.props.item,
      type: "flyer"
    }

    Meteor.call('pdf.generate', data, (err, res) => {
      if (res) {
        saveAs(res.data, res.fileName);
        // this.setState({ databaseStatus: "completed" });
      }
      if (err) {
        // this.setState({ databaseStatus: "failed" });
        console.log(err);
      }
    })
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
            name="hasFlyer"
            value={this.state.hasFlyer}
            onChange={this.onChange}
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
              title="Enviar Novas Imagens"
              type="checkbox"
              id="newImages"
              name="newImages"
              value={this.state.newImages}
              onChange={this.onChange}
            />
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
        <DatabaseStatus status={this.state.databaseStatus}/>
        <FooterButtons buttons={[
          {text: "Visualizar Folder Atual", className: "button--pill", onClick: this.print},
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Salvar", onClick: this.saveEdits}
        ]}/>
      </Box>

    )
  }
}