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

  hasFlyerCheckbox = (e) => {
    var hasFlyer = e.target.value;
    this.setState({
      hasFlyer,
      newImages: false,
      images: []
    })
  }

  newImagesCheckbox = (e) => {
    var newImages = e.target.value;
    this.setState({
      newImages,
      images: newImages ? this.state.images : []
    })
  }

  onChangeParagraph = (e) => {
    function addBulletPoints(input, name) {
      if (name === 0) return input;
      // Remove all bullet points
      input = input.replace(/•\s*/g, "");
      // Add one for each new line
      input = input.replace(/\n/g, "\n• ");
      // Add one at the start of the string
      input = input.replace(/(^.)/g, "• $1");
      return input;
    }
    var value = addBulletPoints(e.target.value, e.target.name);
    var paragraphs = [...this.state.paragraphs];
    paragraphs[e.target.name] = value;
    this.setState({ paragraphs });
  }

  setImages = (e) => {
    this.setState({ images: e.target.value });
  }

  print = () => {
    this.setState({ databaseStatus: "loading" }, () => {
      var data = {
        _id : this.props.item._id,
        type: "flyer",
        flyer: this.props.item.flyer
      }
      Meteor.call('pdf.generate', data, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      })
    })
  }

  saveEdits = () => {
    this.setState({ databaseStatus: "loading" }, () => {
      var data = {
        hasFlyer: this.state.hasFlyer,
        newImages: this.state.newImages,
        paragraphs: this.state.paragraphs,
        _id: this.props.item._id,
        type: "flyer"
      }

      const updateContainer = () => {
        Meteor.call('containers.update.flyer', data, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              callback: () => this.props.toggleWindow()
            }
            this.setState({ databaseStatus });
          }
          if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
        })
      }

      const deleteOldImages = () => {
        return new Promise((resolve, reject) => {
          var _id = this.props.item._id;
          var folder = `user-uploads/images/flyers/${_id}`;
          Meteor.call('aws.delete.directory', folder, (err, res) => {
            if (err) console.log(err);
            if (res) {
              resolve();
            }
          })
        })
      }

      const uploadImages = () => {
        var promises = [];
        this.state.images.forEach((image, i) => {
          promises.push(new Promise((resolve, reject) => {
            var reader = new FileReader();
            var _id = this.props.item._id;
            var filename = this.props.item._id + "_" + i;
            var filePath = `user-uploads/images/flyers/${_id}/${filename}.jpg`;
            reader.onloadend = () => {
              Meteor.call('aws.write', reader.result, filePath, (err, res) => {
                if (err) reject(err);
                if (res) {
                  resolve(res.Location);
                }
              })
            }
            reader.readAsDataURL(image);
          }))
        })
        return Promise.all(promises);
      }

      if (!this.state.hasFlyer) {
        if (this.props.item.flyer && this.props.item.flyer.images.length) {
          deleteOldImages().then(() => {
            updateContainer();
          })
        } else updateContainer();
      } else {
        if (this.state.newImages) {
          deleteOldImages().then(() => {
            uploadImages().then((images) => {
              data.images = images;
              updateContainer();
            }).catch((err) => {
              console.log(err);
            })
          })
        } else updateContainer();
      }
    })
  }

  footerButtons = () => {
    var result = [
      {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
      {text: "Salvar", onClick: this.saveEdits}
    ]

    if (this.props.item.flyer) {
      result.unshift({
        text: "Visualizar Folder Atual",
        className: "button--pill",
        onClick: this.print
      })
    }
    return result;
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
            onChange={this.hasFlyerCheckbox}
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
              disabled={!this.state.hasFlyer}
              value={this.state.newImages}
              onChange={this.newImagesCheckbox}
            />
            {this.state.newImages ?
              <Input
                title="Imagens"
                type="file"
                accept=".jpg"
                preview={true}
                value={this.state.images}
                max={2}
                onChange={this.setImages}/>
            : null}
          </div>
        </div>
        <DatabaseStatus status={this.state.databaseStatus}/>
        <FooterButtons buttons={this.footerButtons()}/>
      </Box>

    )
  }
}