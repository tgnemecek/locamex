import React from "react";

import Widgets from "./Widgets/index";

export default class Dashboard extends React.Component {
  render() {
    if (this.props.user) {
      return (
        <div className="page-content">
          <div className="main-scene dashboard">
            <h1>Página Inicial</h1>
            <h2>Olá {this.props.user.profile.firstName}.</h2>
            <Widgets />
          </div>
        </div>
      );
    } else return null;
  }
}
