import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Users } from '/imports/api/users/index';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {height: "500px", border: "5px solid black"}
    }
  }

  renderOrigin = () => {
    var style = {height: "500px", border: "5px solid black"};

    const onDragStart = (e) => {
      e.dataTransfer.setData("text", "MENSAGEM!!!");
      var style = {
        ...this.state.style,
        cursor: "move"
      }
      this.setState({ style });
    }
    return (
      <div style={this.state.style} draggable={true} onDragStart={onDragStart}>
        ORIGIN
      </div>
    )
  }

  renderDestination = () => {
    function onDragOver(e) {
      e.preventDefault();
    }
    const onDrop = (e) => {
      e.preventDefault();
      var data = e.dataTransfer.getData("text");
      var style = {
        ...this.state.style,
        cursor: "pointer"
      }
      this.setState({ style });
      alert("Peguei a " + data);
    }
    return (
      <div style={{height: "500px", border: "5px solid black"}} onDrop={onDrop} onDragOver={onDragOver}>
        DESTINATION
      </div>
    )
  }

  render() {
    if (this.props.user) {
      return (
        <div className="page-content">
          <div className="dashboard">
            <h1>Página Inicial</h1>
            <h2>Olá {this.props.user.firstName}.</h2>
            <h2>Avisos:</h2>
            <ul>
              <li>Acessórios agora permitem cadastro de diferentes modelos.</li>
              <li>Favor colocar os 'Tipos' dentro de cada acessório, e não fora.</li>
            </ul>
          </div>
          {this.renderOrigin()}
          {this.renderDestination()}
        </div>
      )
    } else return null
  }
}
