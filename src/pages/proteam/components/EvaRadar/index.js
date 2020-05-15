import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class RadarChart extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {
        title: {
          text: '能力分析',
          textStyle: {
            color: 'white',
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
              fontSize: 14,
            },
          },
          indicator: [
            { name: '专业队配置', max: 1 },
            { name: '骨干集训', max: 1 },
            { name: '参加演习', max: 1 },
            { name: '队员集训', max: 1 },
            { name: '岗位训练', max: 1 },
          ],
          radius: 45,
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
            text: '能力分析',
            textStyle: {
              color: 'white',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              let str = '';
              this.props.data.map((item, index) => {
                str += `${
                  prevState.option.radar.indicator[index].name
                } 百分比：${Number(item.percent).toFixed(1)}%<br />`;
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
                fontSize: 14,
              },
            },
            indicator: [
              { name: '专业队配置', max: 60 },
              { name: '骨干集训', max: 10 },
              { name: '参加演习', max: 10 },
              { name: '队员集训', max: 10 },
              { name: '岗位训练', max: 10 },
            ],
            radius: 45,
            center: ['50%', '50%'],
          },
          series: [
            {
              name: '能力分析',
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: this.props.data.map(item =>
                    Number(item.percent).toFixed(1),
                  ),
                  name: '能力分析',
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
