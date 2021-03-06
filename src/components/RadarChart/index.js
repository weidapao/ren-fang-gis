import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class RadarChart extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {
        title: {
          text: '综合评估',
          textStyle: {
            color: 'white',
          },
        },
        grid: {
          top: 40,
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
            { name: '故障率', max: 1 },
            { name: '老化率', max: 1 },
            { name: '巡检率', max: 1 },
            { name: '实名率', max: 1 },
            { name: '换新率', max: 1 },
            { name: '新增率', max: 1 },
          ],
          radius: 35,
          center: ['50%', '60%'],
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
            text: '综合评估',
            textStyle: {
              color: 'white',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              let str = '';
              this.props.data.map((item, index) => {
                str += `${prevState.option.radar.indicator[index].name} 数量：${
                  item.num
                }，百分比：${(item.percent * 100).toFixed(1)}%<br />`;
              });
              return str;
            },
            // position: ['10%', '10%']
          },
          grid: {
            top: 40,
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
              {
                name: `故障${(this.props.data[0].percent * 100).toFixed(1)}%`,
                max: 1,
              },
              {
                name: `老化${(this.props.data[1].percent * 100).toFixed(1)}%`,
                max: 1,
              },
              {
                name: `巡检${(this.props.data[2].percent * 100).toFixed(1)}%`,
                max: 1,
              },
              {
                name: `实名${(this.props.data[3].percent * 100).toFixed(1)}%`,
                max: 1,
              },
              {
                name: `换新${(this.props.data[4].percent * 100).toFixed(1)}%`,
                max: 1,
              },
              {
                name: `新增${(this.props.data[5].percent * 100).toFixed(1)}%`,
                max: 1,
              },
            ],
            radius: 35,
            center: ['50%', '60%'],
          },
          series: [
            {
              name: '综合评估',
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: this.props.data.map(item => item.percent),
                  name: '综合评估',
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
          style={{ width: '100%', height: '190px' }}
          notMerge={true}
          option={this.state.option}
          lazyUpdate={true}
          onEvents={onEvents}
        />
      </div>
    );
  }
}
