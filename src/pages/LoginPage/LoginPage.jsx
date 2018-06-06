import React, { Component } from 'react';
import Login from './components/Login';

export default class LoginPage extends Component {
  static displayName = 'LoginPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="login-page-page">
        <Login />
      </div>
    );
  }
}
