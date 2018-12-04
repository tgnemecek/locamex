import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients/index';

export default class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
      url: 'no url found'
    }
  }

  sendFile = (e) => {
    e.preventDefault();
    var uploader = new Slingshot.Upload("imageUploads");
    Slingshot.fileRestrictions("imageUploads", {
      allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
    });
    uploader.send(this.state.file, function (error, downloadUrl) {
      if (error) {
        // Log service detailed response
        console.error('Error uploading');
        alert (error);
      }
      else {
        this.setState({ url: downloadUrl })
      }
    });
  }

  selectFile = (e) => {
    var files = tools.deepCopy(this.state.files);
    var i = Number(e.target.name);

    files[i] = e.target.value;

    this.setState({ files })
  }


  render() {
    return(
      <form onSubmit={this.sendFile}>
        <input type="file" name="0" onChange={this.selectFile}/>
        <input type="file" name="1" onChange={this.selectFile}/>
        <input type="file" name="2" onChange={this.selectFile}/>
        <input type="file" name="3" onChange={this.selectFile}/>
        <input type="file" name="4" onChange={this.selectFile}/>
        <input type="file" name="5" onChange={this.selectFile}/>
        <p id="status">Please select a file</p>
        <button type="submit">Send</button>
        <p>URL HERE: {this.state.url}</p>
      </form>
    )
  }
}
