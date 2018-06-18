import React from 'react';

export default class ConfirmationMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formError: '',
    }
  };

  renderError() {

    if (typeof(this.props.title) === 'string') {
      return <h3>{this.props.title}</h3>
    }
    if (Array.isArray(this.props.title)) {
      return this.props.title.map((line, index, array) => {
        if (index == 0) {
          return <div key={line.key}><strong>{line.text}</strong></div>
        } else {
          return <div key={line.key}>{line.text}</div>
        }
      })
    }
  }

  render() {
    return(
      <div className="boxed-view boxed-view--modal">
        <div className="boxed-view__box confirmation-message__box">
          {this.renderError()}
          <div className="button__main-div">
            <div className="button__column1of2">
              <button className="button button--secondary" onClick={this.props.unmountMe}>Não</button>
            </div>
            <div className="button__column2of2">
              <button className="button button--danger" onClick={this.props.confirmMe}>Sim</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}