import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class File extends React.Component {
  removeFile = (e) => {
    var files = tools.deepCopy(this.props.files);
    var i = e.target.value;
    files.splice(i, 1);
    this.onChange({
      target: { files }
    })
  }
  onChange = (e) => {
    if (e) {
      var files = Array.from(e.target.files);
      this.props.onChange(files);
    }
  }
  multiple = () => {
    if (!this.props.max || this.props.max === 1) {
      return false;
    } else return true;
  }
  renderText = () => {
    if (this.props.max === 0) throw new Meteor.Error('max-cant-be-0');
    if (!this.props.max || this.props.max === 1) {
      return <span>Enviar Arquivo</span>
    } else {
      return (
        <span>
          Enviar Arquivos <span className="input__file__max">(máximo {this.props.max})</span>
        </span>
      )
    }
  }
  render() {
    return (
      <label className="input__file">
        <input
          type="file"
          files={this.props.files}
          multiple={this.multiple()}
          accept={this.props.accept}
          onChange={this.onChange}

          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}

          style={this.props.style}
          />
        <Icon icon="upload" className="input__file__icon"/>
        {this.renderText()}
      </label>
    )
  }
}