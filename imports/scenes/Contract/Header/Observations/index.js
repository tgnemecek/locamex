import React from 'react';
import ReactModal from 'react-modal';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: this.props.contract.observations
    }
  }

  onChange = (e) => {
    var observations = e.target.value;
    this.setState({ observations });
  }

  saveEdits = () => {
    this.props.contract.observations = this.state.observations;
    this.props.toggleWindow();
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Observações"
          appElement={document.body}
          onRequestClose={this.props.toggleWindow}
          className="observations"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.toggleWindow} className="button--close-box">✖</button>
              <div className="observations__header">
                <h3>Observações:</h3>
              </div>
              <div className="observations__body">
                <textarea value={this.state.observations} onChange={this.onChange}/>
              </div>
              <div className="observations__footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>OK</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}