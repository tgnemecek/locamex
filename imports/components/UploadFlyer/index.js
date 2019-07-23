import React from 'react';

import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class UploadFlyer extends React.Component {
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
    this.setState({ file: e.target.files[0] });
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
        width="700px">
        <Block columns={2} title={"Folder: " + this.props.item.description}>
          <div className="upload-flyer__new-flyer">
            <p>Novo Folder:</p>
            <input type="file" onChange={this.setFile}/>
          </div>
          <div>
            <p>Folder Atual:</p>
            <button className="button--pill" onClick={this.downloadFile}>Baixar</button>
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