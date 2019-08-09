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
    var allowedFileTypes = ["image/jpeg"];
    var maximum = this.props.maximum || 1;

    if (files.length > maximum) {
      return alert(`Favor selecionar até ${maximum} imagens.`);
    }
    for (var file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        alert("Favor selecionar um arquivo de Imagem JPG.");
        return;
      }
    }
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

    const sendWithSnapshot = () => {
      this.setState({ databaseStatus: {status: "loading"} }, () => {
        var promises = this.state.files.map((file, i) => {
          return new Promise((resolve, reject) => {
            var reader = new FileReader();
            var division = file.name.split(".");
            var extension = division[division.length-1];
            var fileName = `ss-${type}-${this.props.item._id}-${code}-${i}`;
            var filePath = `user-uploads/snapshots/series/` +
            `${this.props.item._id}/${date}/${fileName}.${extension}`;

            reader.onloadend = () => {
              resolve({
                dataUrl: reader.result,
                filePath
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

    const sendWithoutSnapshot = () => {
      this.setState({ databaseStatus: {status: "loading"} }, () => {
        var promises = this.state.files.map((file, i) => {
          return new Promise((resolve, reject) => {
            var reader = new FileReader();
            var division = file.name.split(".");
            var extension = division[division.length-1];
            var fileName = `ss-${type}-${this.props.item._id}-${code}-${i}`;
            var filePath = `user-uploads/snapshots/series/` +
            `${this.props.item._id}/${date}/${fileName}.${extension}`;

            reader.onloadend = () => {
              resolve({
                dataUrl: reader.result,
                filePath
              });
            }
            reader.readAsDataURL(file);
          })
        })
        Promise.all(promises).then((filesWithUrl) => {
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
        })
      });
    }

    if (this.props.item.type === "series") sendWithSnapshot();
    if (this.props.item.type === "series") sendWithoutSnapshot();

  }

  removeFile = (i) => {
    var files = this.state.files;
    files.splice(i, 1);
    this.setState({ files });
  }

  renderPreview = () => {
    if (!this.state.files.length) return null;
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table__small-column">#</th>
            <th>Arquivos Selecionados</th>
          </tr>
        </thead>
        <tbody>
          {this.state.files.map((file, i) => {
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{file.name}</td>
                <td className="table__small-column">
                  <button onClick={() => this.removeFile(i)}>
                    <Icon icon="not"/>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
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
              max={10}
              onChange={this.setFiles}/>
              {this.renderPreview()}
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