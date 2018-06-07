/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import axios from 'axios';
import { Input, Button, Grid, Feedback, Select, Icon, Loading } from '@icedesign/base';
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
      usernameShow: true,
      emailShow: false,
      phoneShow: false,
      defaultValue: RegisterData[0],
      visible: false,
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
    if (this.state.usernameShow === true) {
      delete value.email;
      delete value.phoneNum;
    }
    if (this.state.emailShow === true) {
      delete value.username;
      delete value.phoneNum;
    }
    if (this.state.phoneShow === true) {
      delete value.email;
      delete value.username;
    }
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
      let dataStr;
      switch (true) {
        case this.state.usernameShow:
          dataStr = {
            username: this.state.value.username,
            password: this.state.value.passwd,
          };
          break;
        case this.state.emailShow:
          dataStr = {
            email: this.state.value.email,
            password: this.state.value.passwd,
          };
          break;
        case this.state.phoneShow:
          dataStr = {
            mobile: this.state.value.phoneNum,
            password: this.state.value.passwd,
          };
          break;
        default:
          return;
      }
      this.setState({
        visible: true,
      });
      axios.post(REGISTER_API, dataStr, { headers: { 'Content-Type': 'application/json' } }).then((response) => {
        console.log(response);
        console.log('values:', values);
        this.setState({
          visible: false,
        });
        if (response.data.bizCode !== 1) {
          Feedback.toast.success(`注册失败${response.data.bizError}`);
        } else {
          Feedback.toast.success('注册成功');
        }
      }).catch((error) => {
        console.log(error);
        Feedback.toast.success(`注册失败${error}`);
        this.setState({
          visible: false,
        });
      });
    });
  };
  onSelect(value) {
    switch (value) {
      case '用户名':
        this.setState({
          defaultValue: value,
          usernameShow: true,
          emailShow: false,
          phoneShow: false,
        });
        break;
      case '邮箱':
        this.setState({
          usernameShow: false,
          emailShow: true,
          phoneShow: false,
          defaultValue: value,
        });
        break;
      case '手机':
        this.setState({
          defaultValue: value,
          usernameShow: false,
          emailShow: false,
          phoneShow: true,
        });
        break;
      default:
        this.setState({
          defaultValue: RegisterData[0],
        });
    }
  }

  render() {
    // TODO:React.js 控件隐藏写法
    const userInputView = this.state.usernameShow ? (
      <Row style={{ ...styles.formItem }}>
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
      </Row>) : null;
      // TODO:React.js 控件隐藏写法
    const emailIputView = this.state.emailShow ? (
      <Row style={{ ...styles.formItem }}>
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
    ) : null;
    const phoneIputView = this.state.phoneShow ? (
      <Row style={{ ...styles.formItem }}>
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
    ) : null;
    return (

      <div style={styles.container} className="user-register">
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
                {userInputView}
                {emailIputView}
                {phoneIputView}
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
