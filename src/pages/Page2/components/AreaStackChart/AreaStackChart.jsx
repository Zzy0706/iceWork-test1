import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Dialog, Loading, Feedback } from '@icedesign/base';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import IceContainer from '@icedesign/container';

const API_GET_CITY = 'http://pv.sohu.com/cityjson';
const API_URL = 'https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&key=2e47737475a842669c731c29ebc1fd5a';
const Toast = Feedback.toast;
export default class AreaStackChart extends Component {
  static displayName = 'AreaStackChart';
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      visible: false,
      dialogMessage: null,
      footerAlign: 'center',
      visibleLoading: true,
    };
  }
  componentWillMount() {
    const script = document.createElement('script');
    const script2 = document.createElement('script');
    /* script.src = 'https://raw.githubusercontent.com/Zzy0706/MarkDownPhotos/master/hh.js';
    script2.src = 'https://raw.githubusercontent.com/Zzy0706/MarkDownPhotos/master/oo.js'; */
    script.text = '(function(T,h,i,n,k,P,a,g,e){g=function(){P=h.createElement(i);a=h.getElementsByTagName(i)[0];P.src=k;P.charset="utf-8";P.async=1;a.parentNode.insertBefore(P,a)};T["ThinkPageWeatherWidgetObject"]=n;T[n]||(T[n]=function(){(T[n].q=T[n].q||[]).push(arguments)});T[n].l=+new Date();if(T.attachEvent){T.attachEvent("onload",g)}else{T.addEventListener("load",g,false)}}(window,document,"script","tpwidget","//widget.seniverse.com/widget/chameleon.js"))';
    script2.text = 'tpwidget("init", {"flavor": "bubble","location": "WS0E9D8WN298","geolocation": "enabled","position": "top-right","margin": "10px 10px","language": "zh-chs","unit": "c","theme": "chameleon","uid": "U6A7695174","hash": "b480a07f6d79ab4df9168d52bf9bf9b7"});tpwidget("show");';
    document.body.appendChild(script);
    document.body.appendChild(script2);
  }
  componentDidMount() {
    // this.getCityDta();
    this.loadLocalData(); // 获取缓存数据
    // this.getHttpData();
  }
  // 加载缓存，如果无缓存则加载网络数据
  loadLocalData() { // 获取缓存
    try {
      const data = localStorage.getItem('HeWeather6');
      if (data == null) {
        this.getHttpData();
        return;
      }
      const localdataArray = JSON.parse(data);
      const dataArray = [];
      const now = moment().format();
      // now.getFullYear.toString + '-' + now.getMonth.toString + '-' + now.getDay.toString;
      // const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      if (localdataArray.update.loc.substring(0, 10) !== now.substring(0, 10)) {
        this.getHttpData();
        return;
      }
      localdataArray.daily_forecast.map(
        item => dataArray.push(
          { country: localdataArray.basic.location, date: item.date.slice(5), value: parseInt(item.tmp_max, 0) }
        ));
      this.setState({
        data: dataArray,
        visibleLoading: false,
      });
      return this.showView();
    } catch (error) {
      Toast.error(`${error.message}|${error.stack}`);
      return this.setState({
        visible: true,
        dialogMessage: `${error.message}|${error.stack}`,
      });
    }
  }

  getCityDta() {
  /*  const instance = axios.create({
      withCredentials: false,
    }); */
    axios(API_GET_CITY).then((response) => {
      console.log(response);
      return this.loadLocalData();
    }).catch((error) => {
      return this.setState({
        visible: true,
        dialogMessage: `${error.message}|${error.stack}`,
      });
    });
  }
  // 获取网络数据
  getHttpData() {
    axios(API_URL).then((response) => {
      const dataArray = [];
      localStorage.setItem('HeWeather6', JSON.stringify(response.data.HeWeather6[0]));
      response.data.HeWeather6[0].daily_forecast.map(
        item => dataArray.push(
          { country: response.data.HeWeather6[0].basic.location, date: item.date.slice(5), value: parseInt(item.tmp_max, 0) }
        ));
      this.setState({
        data: dataArray,
        visibleLoading: false,
      });
    }).catch((error) => {
      console.log(error);
      Toast.error(`${error.message}|${error.stack}`);
      this.setState({
        visible: true,
        dialogMessage: `${error.message}|${error.stack}`,
      });
    });
    return this.showView();
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showView() {
    const cols = {
      date: {
        type: 'time',
        nice: false,
        mask: 'MM-DD',
      },
    };
    return (
      <div className="area-stack-chart">
        <Loading visible={this.state.visibleLoading} shape="dot-circle" style={{ display: 'block' }}>
          <IceContainer>
            <Chart height={400} data={this.state.data} scale={cols} forceFit>
              <Axis name="date" />
              <Axis name="value" />
              <Legend />
              <Tooltip crosshairs={{ type: 'line' }} />
              <Geom type="area" position="date*value" color="country" />
              <Geom type="line" position="date*value" size={2} color="country" />
            </Chart>
          </IceContainer>
        </Loading>
        <span>
          <Dialog
            visible={this.state.visible}
            onOk={this.onClose}
            onCancel={this.onClose}
            onClose={this.onClose}
            title="网络连接错误!请刷新重试!"
            footerAlign={this.state.footerAlign}
          >
            <div style={{ textAlign: 'center' }}>
              <h3>获取天气数据失败</h3>
              <span>{this.state.dialogMessage}</span>
            </div>
          </Dialog>
        </span>
      </div>
    );
  }
  render() {
    return this.showView();
  }
}
