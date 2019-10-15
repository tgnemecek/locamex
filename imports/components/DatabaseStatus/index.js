import React from 'react';

import Box from '/imports/components/Box/index';
import AsyncAnimation from './AsyncAnimation/index';

// The wrapper receives the prop status, which is a string or object
// Usually its a string: 'loading', 'completed' or 'failed'
// As a string, its behavior will be standard
// If its an object, its custom: {status: 'string', message: 'string'}

class DatabaseStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: true
    }
    this.timeout = this.props.timeout ? this.props.timeout * 1000 : 1000;
  }
  componentDidUpdate(prevProps) {
    if (this.props.status === "loading"
        && prevProps.status !== "loading") {
      this.setState({ showContent: true })
    }
    if (this.props.status === "completed"
        && prevProps.status !== "completed") {
      this.waitForAnimation();
    }
    if (this.props.status === "failed"
        && prevProps.status !== "failed") {
      this.waitForAnimation();
    }
  }

  waitForAnimation = () => {
    setTimeout(() => {
      this.setState({ showContent: false }, () => {
        if (typeof this.props.callback === "function") {
          this.props.callback();
        }
      })
    }, this.timeout);
  }

  className = () => {
    if (!this.props.status) return "";
    return "database-status__" + this.props.status;
  }

  render() {
    if (this.state.showContent && this.props.status) {
      return (
        <Box className="database-status">
          <h2 className={this.className()}>{this.props.message}</h2>
          <AsyncAnimation status={this.props.status} />
        </Box>
      )
    } else return null;
  }
}

export default function DatabaseStatusWrapper(props) {
  var status;
  var message;
  var callback;
  var dictionary = {
    loading: 'Carregando',
    completed: 'Feito!',
    failed: 'Erro de Servidor!'
  }

  if (typeof props.status === 'object') {
    status = props.status.status;
    message = props.status.message || dictionary[props.status.status];
    callback = props.status.callback || null;
  } else {
    status = props.status;
    message = dictionary[status] || "";
  }

  return (
    <DatabaseStatus
      status={status}
      message={message}
      callback={callback}
      timeout={props.timeout}/>
  )
}