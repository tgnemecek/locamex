import React from 'react';

export default class ConfirmationMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formError: ''
    }
  };

  render() {
    return(
      <div className="boxed-view boxed-view--modal">
        <div className="boxed-view__box confirmation-message__box">
          <h3>{this.props.title}</h3>
          {this.state.formError}
          <div className="button__main-div">
            <button className="button button--secondary" onClick={this.props.unmountMe}>Não</button>
            <button className="button button--danger" onClick={this.props.confirmMe}>Sim</button>
          </div>
        </div>
      </div>
    )
  }
}