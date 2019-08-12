import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

// Props:
// maximum (int): maximum number of files
// allowedFileTypes (str[]): ["jpg", "png", "pdf"]

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      databaseStatus: {}
    }
  }

  setFiles = (e) => {
    var files = e.target.value;
    this.setState({ files });
  }

  sendFiles = () => {
    if (!this.state.files.length) {
      alert("Favor escolher pelo menos 1 arquivo.");
      return;
    }
    var _id = this.props.item._id;
    var type = this.props.item.type;

    const throwError = (err) => {
      this.setState({ databaseStatus: {status: "failed"} });
      console.log(err);
    }

    var code = new Date().getTime();

    const sendImagesForSeries = () => {
      var date = moment().format("YYYY-MM-DD") + "_" + code;

      this.setState({ databaseStatus: {status: "loading"} }, () => {
        var promises = this.state.files.map((file, i) => {
          return new Promise((resolve, reject) => {
            var reader = new FileReader();
            var division = file.name.split(".");
            var extension = division[division.length-1];
            var fileName = `series-${this.props.item._id}-${code}-${i}.${extension}`;
            var filePath = `user-uploads/images/series/` + `${this.props.item._id}/${date}/`;
            var key = filePath + fileName;

            reader.onloadend = () => {
              resolve({
                dataUrl: reader.result,
                filePath: key
              });
            }
            reader.readAsDataURL(file);
          })
        })
        Promise.all(promises).then((filesWithUrl) => {
          Meteor.call('aws.write.multiple', filesWithUrl, (err, urls) => {
            if (err) throwError(err);
            if (urls) {
              Meteor.call('snapshot.add', this.props.item, urls, (err, res) => {
                if (err) throwError(err);
                if (res) {
                  this.setState({ databaseStatus: {status: "completed"} });
                }
              })
            }
          })
        })
      });
    }

    const sendImagesForAccessories = () => {
      var filePath = `user-uploads/images/accessories/${this.props.item._id}/`;

      this.setState({ databaseStatus: {status: "loading"} }, () => {
        var promises = this.state.files.map((file, i) => {
          return new Promise((resolve, reject) => {
            var reader = new FileReader();
            var division = file.name.split(".");
            var extension = division[division.length-1];
            var fileName = `${type}-${this.props.item._id}-${code}-${i}.${extension}`;
            var key = filePath + fileName;

            reader.onloadend = () => {
              resolve({
                dataUrl: reader.result,
                filePath: key
              });
            }
            reader.readAsDataURL(file);
          })
        })
        Promise.all(promises).then((filesWithUrl) => {
          Meteor.call('aws.delete.directory', filePath, (err, res) => {
            if (err) throwError(err);
            if (res) {
              Meteor.call('aws.write.multiple', filesWithUrl, (err, urls) => {
                if (err) throwError(err);
                if (urls) {
                  Meteor.call('accessories.update.one', this.props.item._id, "images", urls, (err, res) => {
                    if (err) throwError(err);
                    if (res) {
                      this.setState({ databaseStatus: {status: "completed"} });
                    }
                  })
                }
              })
            }
          })
        })
      });
    }

    if (this.props.item.type === "series") {
      sendImagesForSeries();
    } else if (this.props.item.type === "accessory") {
      sendImagesForAccessories();
    } else throw new Meteor.Error('type-not-set');
  }

  removeFile = (i) => {
    var files = this.state.files;
    files.splice(i, 1);
    this.setState({ files });
  }

  render() {
    return (
      <Box
        title="Selecione os arquivos para envio"
        width="600px"
        closeBox={this.props.toggleWindow}>
        <div className="error-message">{this.state.errorMsg}</div>
        <div className="image-visualizer__uploader">
          <div>
            <Input
              type="file"
              accept=".jpg"
              preview={true}
              removeFile={this.removeFile}
              max={this.props.params.maximum}
              allowedFileTypes={this.props.params.allowedFileTypes}
              onChange={this.setFiles}/>
          </div>
        </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Enviar Imagens", onClick: this.sendFiles}
          ]}/>
          <DatabaseStatus
            callback={this.props.closeParent}
            status={this.state.databaseStatus.status}
            message={this.state.databaseStatus.message}/>
      </Box>
    )
  }
}