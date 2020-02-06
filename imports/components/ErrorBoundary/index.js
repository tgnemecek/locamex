import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page-content">
          <h2>Ocorreu um erro.</h2>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <div>
              {this.state.error && this.state.error.toString()}
            </div>
            <div>
              {this.state.errorInfo.componentStack}
            </div>
          </div>
        </div>
      )
    } else return this.props.children;
  }
}