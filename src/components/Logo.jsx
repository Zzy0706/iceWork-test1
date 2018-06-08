import React, { PureComponent } from 'react';
import {} from 'react-router-dom';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={style.logo}>
        {/*
        <Link to="http://www.qq.com" className="logo-text">
          QQ.COM
        </Link>
        */}
        <a href="http://www.qq.com" className="logo-text">
          <img
            src="https://github.com/Zzy0706/MarkDownPhotos/raw/master/hb.png"
            style={style.logo}
            alt="logo"
          />
        </a>
      </div>
    );
  }
}
const style = {
  logo: {
    marginRight: '10px',
    width: '48px',
  },
};
