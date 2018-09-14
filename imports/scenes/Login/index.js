import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      username: '',
      password: '',
      error: ''
    };
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  submit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    Meteor.loginWithPassword({username}, password, (err) => {
      if (err) {
        this.setState({error: 'Falha de Login. Favor checar os dados.'});
      } else {
        this.setState({error: ''});
      }
    });
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    return (
      <div className="login__background">
        <div className="login__box">
          <h1>Login</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form onSubmit={this.submit} className="boxed-view__form">
            <Input
              title="Usuário:"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
            />
            <Input
              title="Senha:"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
            />
            <FooterButtons buttons={[
              {text: "Login", type: "submit"}
            ]}/>
          </form>
        </div>
      </div>
    )
  }
}
