/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import axios from 'axios';
import { createHashHistory } from 'history';
import { Input, Button, Checkbox, Grid, Feedback, Loading } from '@icedesign/base';
import { Link } from 'react-router-dom';

import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './Login.scss';

const { Row, Col } = Grid;
const LOG_API = '/sso/user/login';
export default class Login extends Component {
  static displayName = 'Login';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        account: '',
        password: '',
        checkbox: false,
      },
      visible: false,
    };
  }
  formChange = (value) => {
    this.setState({
      value,
    });
  };
  componentDidMount() {
    this.getLocaUserData();
  }
  getLocaUserData() {
    const userData = JSON.parse(localStorage.getItem('AccPass'));
    if (userData == null) {
      return;
    }
    this.setState({
      value: {
        account: userData.username,
        checkbox: true,
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      if (this.state.value.checkbox === true) {
        localStorage.setItem('AccPass', JSON.stringify({
          username: this.state.value.account,
        }));
      } else {
        localStorage.removeItem('AccPass');
      }
      this.setState({
        visible: true,
      });
      axios.post(LOG_API, {
        username: this.state.value.account,
        password: this.state.value.password,
      }, { headers: { 'Content-Type': 'application/json' } }).then((response) => {
        console.log(response);
        console.log('values:', values);
        this.setState({
          visible: false,
        });
        if (response.data.bizCode !== 1) {
          Feedback.toast.success(`登入失败${response.data.bizRemind}`);
        } else {
          Feedback.toast.success('登录成功');
          createHashHistory().push('/page2');
        }
      }).catch((error) => {
        console.log(error);
        Feedback.toast.success(`登录失败${error}`);
        this.setState({
          visible: false,
        });
      });
      // 登录成功后做对应的逻辑处理
    });
  };

  render() {
    return (
      <div style={styles.container} className="user-login">
        <div style={styles.header}>
          <a style={styles.meta}>
            <img
              style={styles.logo}
              src="https://github.com/Zzy0706/MarkDownPhotos/raw/master/hb.png"
              alt="logo"
            />
            <span style={styles.title}>滑冰</span>
          </a>
          <p style={styles.desc}>滑冰---体验滑的感觉</p>
        </div>
        <div style={styles.formContainer}>
          <Loading visible={this.state.visible} shape="fusion-reactor">
            <h4 style={styles.formTitle}>登 录</h4>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formItems}>
                <Row style={styles.formItem}>
                  <Col style={styles.formItemCol}>
                    <IceIcon
                      type="person"
                      size="small"
                      style={styles.inputIcon}
                    />
                    <IceFormBinder name="account" required message="必填">
                      <Input
                        size="large"
                        maxLength={20}
                        placeholder="管理员账号"
                      >
                        {this.state.value.account}
                      </Input>
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="account" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col style={styles.formItemCol}>
                    <IceIcon type="lock" size="small" style={styles.inputIcon} />
                    <IceFormBinder name="password" required message="必填">
                      <Input
                        size="large"
                        htmlType="password"
                        placeholder="密码"
                      />
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="password" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col>
                    <IceFormBinder name="checkbox">
                      <Checkbox style={styles.checkbox} checked={this.state.value.checkbox} >记住账号</Checkbox>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    style={styles.submitBtn}
                  >
                    登 录
                  </Button>
                </Row>

                <Row className="tips" style={styles.tips}>
                  <Link to="/RegisterPage" style={styles.link}>
                    立即注册
                  </Link>
                  <span style={styles.line}>|</span>
                  <Link to="/RegisterPage" style={styles.link}>
                    忘记密码
                  </Link>
                </Row>
              </div>
            </IceFormBinderWrapper>
          </Loading>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    paddingTop: '100px',
    background: '#f0f2f5',
    backgroundImage:
      'url(https://img.alicdn.com/tfs/TB1kOoAqv1TBuNjy0FjXXajyXXa-600-600.png)',
    /* backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%', */
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center',
    fontSize: '33px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: 'Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif',
    fontWeight: '600',
  },
  desc: {
    margin: '10px 0',
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.45)',
  },
  logo: {
    marginRight: '10px',
    width: '48px',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '368px',
    margin: '0 auto',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
    padding: '0',
  },
  formItemCol: {
    position: 'relative',
    padding: '0',
  },
  formTitle: {
    textAlign: 'center',
    margin: '0 0 20px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 'bold',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  submitBtn: {
    fontSize: '16px',
    height: '40px',
    lineHeight: '40px',
    background: '#3080fe',
    borderRadius: '4px',
  },
  checkbox: {
    marginLeft: '5px',
  },
  tips: {
    justifyContent: 'center',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '13px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};
