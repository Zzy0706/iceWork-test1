import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Dialog, Loading } from '@icedesign/base';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import IceContainer from '@icedesign/container';


const API_URL = 'https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&key=2e47737475a842669c731c29ebc1fd5a';
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
  componentDidMount() {
    this.loadLocalData(); // 获取缓存数据
    // this.getHttpData();
  }
  // 加载缓存，如果无缓存则加载网络数据
  loadLocalData() { // 获取缓存
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
      this.setState({
        visible: true,
        dialogMessage: error,
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
            <h3>获取天气数据失败</h3>
            <span>{this.state.dialogMessage}123</span>
          </Dialog>
        </span>
      </div>
    );
  }
  render() {
    return this.showView();
  }
}
