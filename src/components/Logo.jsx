import React, { PureComponent } from 'react';
import {} from 'react-router-dom';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        {/*
        <Link to="http://www.qq.com" className="logo-text">
          QQ.COM
        </Link>
        */}
        <a href="http://www.qq.com" className="logo-text">
         QQ.COM
        </a>
      </div>
    );
  }
}
