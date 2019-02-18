import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import createMetaContext from './create-meta-context/index';

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

    var areInvalid = validateFiles(sortedFiles, this.props.uploadDirective);

    if (areInvalid) {
      this.setState({ errorMsg: areInvalid.translation});
      return;
    }

    var metaContext;
    var sendCount = 0;

    sortedFiles.forEach((file, imageIndex, arr) => {
      metaContext = createMetaContext(this.props.item, imageIndex, file);
      var uploader = new Slingshot.Upload(this.props.uploadDirective, metaContext);
      uploader.send(file, (error, downloadUrl) => {
        sendCount++;
        if (!error) {
          urls[imageIndex] = downloadUrl;
          if (sendCount === arr.length) {
            Meteor.call('snapshot.add', metaContext, urls);
            alert(urls.length + ' arquivo(s) enviado(s) com sucesso!');
            this.props.toggleWindow(true);
          }
        } else console.error(error);
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
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Enviar Imagens", onClick: this.sendFiles}
          ]}/>
      </Box>
    )
  }
}

function validateFiles(files, uploadDirective) {
  var maxSize = 10 * 1024 * 1024;
  Slingshot.fileRestrictions(uploadDirective, {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize
  });
  for (var i = 0; i < files.length; i++) {
    var uploader = new Slingshot.Upload(uploadDirective);
    var error = uploader.validate(files[i]);
    if (error) {
      console.error(error);
      var translation;
      if (error.message.search('size')) translation = `Imagem excede o tamanho limite de ${maxSize} Bytes.`;
      if (error.message.search('file types')) translation = `Formato de arquivo inválido. Use apenas imagens PNG ou JPEG.`;
      return {...error, translation};
    }
  }
  return false;
}