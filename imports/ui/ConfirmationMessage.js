import React from 'react';

export default class ConfirmationMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formError: ''
    }
  };

  renderError() {
    if (typeof(this.props.title) === 'string') {
      return <h3>{this.props.title}</h3>
    }
    if (Array.isArray(this.props.title)) {
      return this.props.title.map((line) => {
        return <h3 key={line}>{line}</h3>
      })
    }
  }

  render() {
    return(
      <div className="boxed-view boxed-view--modal">
        <div className="boxed-view__box confirmation-message__box">
          {this.renderError()}
          <div className="button__main-div">
            <button className="button button--secondary" onClick={this.props.unmountMe}>Não</button>
            <button className="button button--danger" onClick={this.props.confirmMe}>Sim</button>
          </div>
        </div>
      </div>
    )
  }
}