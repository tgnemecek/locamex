import React from 'react';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class FlyerUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      databaseStatus: ''
    }
  }

  downloadFile = () => {
    var url = this.props.item.flyer;
    if (!url) return;
    window.open(url, "_blank");
  }

  setFile = (e) => {
    var file = [e.target.value[0]];
    this.setState({ file });
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
    this.setState({ databaseStatus: "loading" });
    reader.onloadend = () => {
      Meteor.call('aws.write', reader.result, filePath, (err, res) => {
        if (err) console.log(err);
        if (res) {
          var key = "flyer";
          var value = res.Location;
          Meteor.call('containers.update.one', _id, key, value, () => {
            this.setState({ databaseStatus: "completed" });
          });
        }
      })
    }
    reader.readAsDataURL(this.state.file[0]);
  }

  removeFile = () => {
    this.setState({ file: null });
  }

  render() {
    return (
      <Box
        className="containers-table__flyer-uploader"
        closeBox={this.props.toggleWindow}
        title={"Editar Folder do Produto: " + this.props.item.description}
        width="800px">
        <Block columns={2}>
          <div className="containers-table__flyer-uploader__new-flyer">
            <p>Novo Folder:</p>
            <Input
              type="file"
              accept=".pdf"
              preview={true}
              allowedFileTypes={["application/pdf"]}
              removeFile={this.removeFile}
              value={this.state.file}
              max={1}
              onChange={this.setFile}/>
          </div>
          <div className="containers-table__flyer-uploader__current-flyer">
            <p>Folder Atual:</p>
            {this.button()}
          </div>
        </Block>
        <DatabaseStatus
          callback={this.props.toggleWindow}
          status={this.state.databaseStatus}/>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Enviar", onClick: this.saveEdits}
        ]}/>
      </Box>

    )
  }
}