import React, { Component } from 'react';
import Register from './components/Register';

export default class RegisterPage extends Component {
  static displayName = 'RegisterPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="register-page-page">
        <Register />
      </div>
    );
  }
}
