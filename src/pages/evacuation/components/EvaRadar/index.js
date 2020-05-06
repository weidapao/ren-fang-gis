import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class RadarChart extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {
        title: {
          text: '能力值数据分析',
          textStyle: {
            color: 'white',
          }
        },
        grid: {
          top: 20,
          right: 0,
          bottom: 10,
          left: 0,
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: 'white',
              backgroundColor: 'rgb(33,76,82)',
              fontWeight: 'bold',
              borderRadius: 3,
              padding: [6, 10],
              fontSize:14
            },
          },
          indicator: [
            { name: '疏散基地战时转换预留量', max: 1 },
            { name: '疏散基\n地安置\n容量', max: 1 },
            { name: '疏散基地战\n时生活保障\n能力', max: 1 },
            { name: '疏散基地开\n发利用和维\n护管理能力', max: 1 },
            { name: '指挥交通\n通讯医疗\n必备设施\n配备', max: 1 },
          ],
          radius: 65,
        },
        series: [
          {
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [
              // {
              //   value: [0.8, 0.5, 0.7, 0.6, 0.3, 0.2],
              //   name: '预算分配（Allocated Budget）',
              // },
            ],
          },
        ],
      },
      data: null,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data && nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.data && prevState.data !== this.state.data) {
      this.setState({
        option: {
          title: {
            text: '能力值数据分析',
            textStyle: {
              color: 'white',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              let str = '';
              this.props.data.map((item, index) => {
                str += `${prevState.option.radar.indicator[index].name} 数量：${item.num}，百分比：${(item.percent*100).toFixed(2)}%<br />`;
              });
              return str;
            },
          },
          grid: {
            top: 20,
            right: 0,
            bottom: 10,
            left: 0,
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: 'white',
                backgroundColor: 'rgb(33,76,82)',
                fontWeight: 'bold',
                borderRadius: 3,
                padding: [6, 10],
                fontSize:14
              },
            },
            indicator: [
              { name: '疏散基地战时转换预留量', max: 1 },
              { name: '疏散基\n地安置\n容量', max: 1 },
              { name: '疏散基地战\n时生活保障\n能力', max: 1 },
              { name: '疏散基地开\n发利用和维\n护管理能力', max: 1 },
              { name: '指挥交通\n通讯医疗\n必备设施\n配备', max: 1 },
            ],
            radius: 65,
          },
          series: [
            {
              name: '能力值数据分析',
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: this.props.data.map(item => item.percent),
                  name: '能力值数据分析',
                },
              ],
            },
          ],
        },
      });
    }
  }
  render() {
    let onEvents = {
      click: e => {
        console.log(e);
      },
    };
    return (
      <div style={{ height: '100%' }}>
        <ReactEcharts
          style={{ width: '100%', height: '100%' }}
          notMerge={true}
          option={this.state.option}
          lazyUpdate={true}
          onEvents={onEvents}
        />
      </div>
    );
  }
}
