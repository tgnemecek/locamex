import React from 'react';

import Box from '/imports/components/Box/index';
import AsyncAnimation from '/imports/components/AsyncAnimation/index';

export default class DatabaseStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: true
    }
    this.timeout = this.props.timeout ? this.props.timeout * 1000 : 1000;
  }
  componentDidUpdate(prevProps) {
    if (this.props.status === "loading" && prevProps.status !== "loading") {
      this.setState({ showContent: true })
    }
    if (this.props.status === "completed" && prevProps.status !== "completed") {
      this.waitForAnimation();
    }
    if (this.props.status === "failed" && prevProps.status !== "failed") {
      this.waitForAnimation();
    }
  }

  waitForAnimation = () => {
    setTimeout(() => {
      this.setState({ showContent: false })
    }, this.timeout);
  }

  className = () => {
    if (!this.props.status) return "";
    return "database-status__" + this.props.status;
  }
  render() {
    if (this.state.showContent && this.props.status) {
      return (
        <Box className="database-status" width="40%" height="190px">
          <h2 className={this.className()}></h2>
          <AsyncAnimation status={this.props.status} />
        </Box>
      )
    } else return null;
  }
}