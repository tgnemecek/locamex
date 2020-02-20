import React from 'react';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

class SubFile extends React.Component {
  render() {
    return (
      <input type="file"
        multiple={this.props.multiple}
        accept={this.props.accept}
        onChange={this.props.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}/>
    )
  }
}
export default class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    }
  }
  removeFiles = () => {
    this.props.onChange([]);
    this.setState({ key: this.state.key+1 });
  }
  onChange = (e) => {
    if (e) {
      var files = Array.from(e.target.files);
      if (files.length > this.props.max) {
        this.removeFiles();
        return alert(`Favor selecionar até ${this.props.max} imagens.`);
      }
      if (this.props.accept) {
        var dictionary = {
          '.jpg': 'image/jpeg'
        }
        var accept = dictionary[this.props.accept] || this.props.accept;
        for (var file of files) {
          if (file.type !== accept) {
            this.removeFiles();
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
    if (!this.props.files) return null;
    if (!this.props.files.length) return null;
    return (
      <div className="input__file__scroll">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th className="table__wide">Arquivos Selecionados</th>
              <th className="no-padding">
                <button onClick={this.removeFiles}>
                  <Icon icon="not"/>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.files.map((file, i) => {
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td className="table__wide" colSpan={2}>{file.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
  render() {
    return (
      <>
        <label className="input__file__label">
          <SubFile
            key={this.state.key}
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
