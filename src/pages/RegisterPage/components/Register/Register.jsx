/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import axios from 'axios';
import { Input, Button, Grid, Feedback, Select, Icon } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './Register.scss';

const { Row, Col } = Grid;
const REGISTER_API = '/sso/register/save';
const RegisterData = [
  '用户名',
  '邮箱',
  '手机',
];
export default class Register extends Component {
  static displayName = 'Register';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        email: '',
        phoneNum: '',
        passwd: '',
        rePasswd: '',
      },
      usernameIput: 'block',
      emailIput: 'none',
      phoneNumIput: 'none',
      defaultValue: RegisterData[0],
      visible: true,
    };
  }

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  checkPasswd2 = (rule, values, callback, stateValues) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values && values !== stateValues.passwd) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };
  checkPhoneNum = (rule, values, callback) => {
    if (!values.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
      callback('请输入正确的手机号');
    } else {
      callback();
    }
  };
  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    // TODO: 分离检验器的检查,使有用户名，邮箱，手机号中的一个加密码正确仅能够提交
    // TODO: 如果用户用户名，邮箱，手机号选项框都填写了内容,应以用户选择的最后一个条件进行提交，其余清空
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      console.log('values:', values);
      /*
      axios.post(REGISTER_API, {
        username: this.state.value.account,
        password: this.state.value.password,
      }, { headers: { 'Content-Type': 'application/json' } }).then((response) => {
        console.log(response);
        console.log('values:', values);
        this.setState({
          visible: false,
        });
        Feedback.toast.success('注册成功');
        createHashHistory().push('/page2');
      }).catch((error) => {
        console.log(error);
        Feedback.toast.success(`注册失败${error}`);
        this.setState({
          visible: false,
        });
      });
      */
    });
  };
  onSelect(value) {
    switch (value) {
      case '用户名':
        this.setState({
          usernameIput: 'block',
          emailIput: 'none',
          phoneNumIput: 'none',
          defaultValue: value,
        });
        break;
      case '邮箱':
        this.setState({
          usernameIput: 'none',
          emailIput: 'block',
          phoneNumIput: 'none',
          defaultValue: value,
        });
        break;
      case '手机':
        this.setState({
          usernameIput: 'none',
          emailIput: 'none',
          phoneNumIput: 'block',
          defaultValue: value,
        });
        break;
      default:
        this.setState({
          usernameIput: 'block',
          emailIput: 'none',
          phoneNumIput: 'none',
          defaultValue: RegisterData[0],
        });
    }
  }
  render() {
    return (
      <div style={styles.container} className="user-register">
        <div style={styles.header}>
          <a href="#" style={styles.meta}>
            <img
              style={styles.logo}
              src="https://img.alicdn.com/tfs/TB13UQpnYGYBuNjy0FoXXciBFXa-242-134.png"
              alt="logo"
            />
            <span style={styles.title}>飞冰</span>
          </a>
          <p style={styles.desc}>飞冰让前端开发简单而友好</p>
        </div>
        <div style={styles.formContainer}>
          <h4 style={styles.formTitle}>注 册</h4>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formItems}>
              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <Select
                    placeholder="选择注册方式"
                    dataSource={RegisterData}
                    onChange={this.onSelect.bind(this)}
                    value={this.state.defaultValue}
                  />
                </Col>
              </Row>
              <Row style={{ ...styles.formItem, display: this.state.usernameIput }}>
                <Col style={styles.formItemCol}>
                  <IceIcon
                    type="person"
                    size="small"
                    style={styles.inputIcon}
                  />
                  <IceFormBinder
                    name="username"
                    required
                    message="请输入正确的用户名"
                  >
                    <Input size="large" placeholder="用户名" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="username" />
                </Col>
              </Row>

              <Row style={{ ...styles.formItem, display: this.state.emailIput }}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="mail" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    type="email"
                    name="email"
                    required
                    message="请输入正确的邮箱"
                  >
                    <Input size="large" maxLength={20} placeholder="邮箱" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="email" />
                </Col>
              </Row>
              <Row style={{ ...styles.formItem, display: this.state.phoneNumIput }}>
                <Col style={styles.formItemCol}>
                  <Icon type="mobile-phone" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="phoneNum"
                    required
                    validator={this.checkPhoneNum}
                  >
                    <Input size="large" maxLength={20} placeholder="手机号" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="phoneNum" />
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="passwd"
                    required
                    validator={this.checkPasswd}
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="至少8位密码"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="passwd" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="rePasswd"
                    required
                    validator={(rule, values, callback) =>
                      this.checkPasswd2(
                        rule,
                        values,
                        callback,
                        this.state.value
                      )
                    }
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="确认密码"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="rePasswd" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={styles.submitBtn}
                >
                  注 册
                </Button>
              </Row>

              <Row style={styles.tips}>
                <a href="/" style={styles.link}>
                  使用已有账户登录
                </a>
              </Row>
            </div>
          </IceFormBinderWrapper>
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
