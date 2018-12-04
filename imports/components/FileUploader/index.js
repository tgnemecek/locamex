import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [null, null, null, null, null, null],
      errorMsg: false
    }
  }

  sendFiles = (e) => {
    var files = this.state.files;
    var sortedFiles = [];
    var urls = [];

    files.forEach((file) => {
      if (file) sortedFiles.push(file);
    })

    if (!sortedFiles.length) {
      this.setState({ errorMsg: "Favor selecionar pelo menos um arquivo." });
      return;
    }

    var formattedDate = moment().format("YYYY-MM-DD");

    if (areInvalid(sortedFiles, this.props.uploadDirective)) {
      this.setState({ errorMsg: "Formato de arquivo inválido."});
      return;
    }

    var successCount = 0

    sortedFiles.forEach((file, imageIndex) => {
      var metaContext = {
        filename: this.props.item.description,
        itemId: this.props.item._id,
        itemType: this.props.item.itemType,
        imageIndex,
        extension: file.name.split('.').pop(),
        formattedDate
      }
      var uploader = new Slingshot.Upload(this.props.uploadDirective, metaContext);

      uploader.send(file, (error, downloadUrl) => {
        if (!error) {
          successCount++;
          urls.push(downloadUrl);
          if ((imageIndex+1) == sortedFiles.length) {
            Meteor.call('snapshot.add', metaContext.itemType, metaContext.itemId, urls);
            alert(successCount + ' arquivo(s) enviado(s) com sucesso!');
            this.props.toggleWindow(true);
          }
        }
      });
    })
  }

  selectFile = (e) => {
    var files = [];
    this.state.files.forEach((file) => {
      files.push(file);
    })
    var i = Number(e.target.name);
    var value = e.target.files[0];

    files[i] = value;

    this.setState({ files })
  }

  render() {
    return (
      <Box
        title="Selecione os arquivos para envio"
        width="600px"
        closeBox={this.props.toggleWindow}>
        <div className="error-message">{this.state.errorMsg}</div>
        <div className="file-uploader__files-div">
          <div>
            <label>1.</label><input type="file" name="0" onChange={this.selectFile}/>
          </div>
          <div>
            <label>2.</label><input type="file" name="1" onChange={this.selectFile}/>
          </div>
          <div>
            <label>3.</label><input type="file" name="2" onChange={this.selectFile}/>
          </div>
          <div>
            <label>4.</label><input type="file" name="3" onChange={this.selectFile}/>
          </div>
          <div>
            <label>5.</label><input type="file" name="4" onChange={this.selectFile}/>
          </div>
          <div>
            <label>6.</label><input type="file" name="5" onChange={this.selectFile}/>
          </div>
        </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
            {text: "Enviar Imagens", onClick: () => this.sendFiles()}
          ]}/>
      </Box>
    )
  }
}

function areInvalid(files, uploadDirective) {
  Slingshot.fileRestrictions(uploadDirective, {
    allowedFileTypes: ["image/png", "image/jpeg"]
  });
  for (var i = 0; i < files.length; i++) {
    var uploader = new Slingshot.Upload(uploadDirective);
    var error = uploader.validate(files[i]);
    if (error) {
      return error;
    }
  }
  return false;
}