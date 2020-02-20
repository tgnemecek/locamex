import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      databaseStatus: ''
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

    this.setState({ databaseStatus: "loading" }, () => {
      var promises = this.state.files.map((file, i) => {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          }
          reader.readAsDataURL(file);
        })
      })
      Promise.all(promises).then((arrayOfDataUrls) => {
        this.props.upload(arrayOfDataUrls, (err, res) => {
          if (res) this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleWindow
          } })
          if (err) this.setState({ databaseStatus: {
            status: "failed",
            message: tools.translateError(err),
            callback: this.props.toggleWindow
          } })
        });
      })
    })
  }

  render() {
    return (
      <Box
        title="Selecione os arquivos para envio"
        className="file-uploader"
        closeBox={this.props.toggleWindow}>
        {this.props.children}
        <Input
          type="file"
          accept={this.props.accept}
          preview={true}
          max={this.props.maximum}
          files={this.state.files}
          onChange={this.setFiles}/>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Enviar Imagens", onClick: this.sendFiles}
        ]}/>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </Box>
    )
  }
}