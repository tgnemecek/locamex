import React from 'react';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class FlyerUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      databaseStatus: {}
    }
  }

  downloadFile = () => {
    var url = this.props.item.flyer;
    if (!url) return;
    window.open(url, "_blank");
  }

  setFile = (e) => {
    var file = e.target.files[0];
    if (file.type !== "application/pdf") {
      alert("Favor selecionar um arquivo PDF.")
    } else this.setState({ file });
  }

  button = () => {
    if (this.props.item.flyer) {
      return (
        <button className="button--pill" onClick={this.downloadFile}>
          BAIXAR
        </button>
      )
    } else {
      return (
        <button className="button--disabled">
          FOLDER NÃO ENCONTRADO
        </button>
      )
    }
  }

  saveEdits = () => {
    var reader = new FileReader();
    var _id = this.props.item._id;
    var type = this.props.item.type;
    var filename = this.props.item.description;
    var filePath = `user-uploads/flyers/${type}/${_id}/${filename}.pdf`;
    this.setState({ databaseStatus: {status: "loading"} });
    reader.onloadend = () => {
      Meteor.call('aws.write', reader.result, filePath, (err, res) => {
        if (err) console.log(err);
        if (res) {
          var key = "flyer";
          var value = res.Location;
          Meteor.call('containers.update.one', _id, key, value, () => {
            this.setState({ databaseStatus: {status: "completed"} });
          });
        }
      })
    }
    reader.readAsDataURL(this.state.file);
  }

  render() {
    return (
      <Box
        className="upload-flyer"
        closeBox={this.props.toggleWindow}
        title={"Editar Folder do Produto: " + this.props.item.description}
        width="800px">
        <Block columns={2}>
          <div className="upload-flyer__new-flyer">
            <p>Novo Folder:</p>
            <input
              type="file"
              accept=".pdf"
              files={[this.state.file]}
              onChange={this.setFile}/>
          </div>
          <div className="upload-flyer__current-flyer">
            <p>Folder Atual:</p>
            {this.button()}
          </div>
        </Block>
        <DatabaseStatus
          callback={this.props.toggleWindow}
          status={this.state.databaseStatus.status}
          message={this.state.databaseStatus.message}/>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Enviar", onClick: this.saveEdits}
        ]}/>
      </Box>

    )
  }
}