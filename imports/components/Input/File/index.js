import React from 'react';
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
      if (files.length > this.props.max) {
        return alert(`Favor selecionar até ${this.props.max} imagens.`);
      }
      if (this.props.allowedFileTypes) {
        for (var file of files) {
          if (!this.props.allowedFileTypes.includes(file.type)) {
            return alert("Favor selecionar um arquivo válido.");
          }
        }
      }
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
  renderPreview = () => {
    if (!this.props.preview) return null;
    if (!this.props.value) return null;
    if (!this.props.value.length) return null;
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table__small-column">#</th>
            <th>Arquivos Selecionados</th>
          </tr>
        </thead>
        <tbody>
          {this.props.value.map((file, i) => {
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{file.name}</td>
                <td className="table__small-column">
                  <button onClick={() => this.props.removeFile(i)}>
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
      <>
        <label className="input__file">
          <input
            type="file"
            files={this.props.value}
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
        {this.renderPreview()}
      </>
    )
  }
}