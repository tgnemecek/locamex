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
      files: [],
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

    var uploads = sortedFiles.forEach((file, imageIndex) => {
      var metaContext = {
        itemId: this.props.item._id,
        itemType: this.props.item.itemType,
        imageIndex,
        extension: file.name.split('.').pop(),
        formattedDate
      }
      var uploader = new Slingshot.Upload("imageUploads", metaContext);
      Slingshot.fileRestrictions("imageUploads", {
        allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
        maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
      });
      uploader.send(file, (error, downloadUrl) => {
        if (error) {
          this.setState({ errorMsg: "Erro de servidor. Tente mais tarde." });
        }
        else {
          urls.push(downloadUrl);
          if (urls.length == sortedFiles.length) {
            Meteor.call('snapshot.add', metaContext.itemType, metaContext.itemId, urls);
            alert('Arquivos enviados com sucesso!');
            this.props.toggleWindow();
          }
        }
      });
    })
  }

  selectFile = (e) => {
    var files = [];
    this.state.files.forEach((file) => {
      if (file) files.push(file);
    })
    var i = Number(e.target.name);
    var value = e.target.files[0];

    files[i] = value;

    this.setState({ files })
  }

  render() {
    return (
      <Box
        title="Selecione as Imagens"
        width="600px"
        closeBox={this.props.toggleWindow}>
        <div className="error-message">{this.state.errorMsg}</div>
        <div>
          <input type="file" name="0" onChange={this.selectFile}/>
          <input type="file" name="1" onChange={this.selectFile}/>
          <input type="file" name="2" onChange={this.selectFile}/>
          <input type="file" name="3" onChange={this.selectFile}/>
          <input type="file" name="4" onChange={this.selectFile}/>
          <input type="file" name="5" onChange={this.selectFile}/>
        </div>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
            {text: "Enviar Imagens", onClick: () => this.sendFiles()}
          ]}/>
      </Box>
    )
  }
}