import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

const final = [
  { name: '指挥能力', max: 20 },
  { name: '安置容量', max: 16 },
  { name: '生活保障', max: 16 },
  { name: '设施设备', max: 16 },
  { name: '援助能力', max: 16 },
  { name: '教育保障', max: 16 },
];

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
            { name: '指挥能力', max: 20 },
            { name: '安置容量', max: 16 },
            { name: '生活保障', max: 16 },
            { name: '设施设备', max: 16 },
            { name: '援助能力', max: 16 },
            { name: '教育保障', max: 16 },
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
                str += `${final[index].name}：${Number(item.num).toFixed(
                  1,
                )}<br />`;
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
              { name: '指挥能力', max: 20 },
              { name: '安置容量', max: 16 },
              { name: '生活保障', max: 16 },
              { name: '设施设备', max: 16 },
              { name: '援助能力', max: 16 },
              { name: '教育保障', max: 16 },
            ],
            radius: 45,
            center: ['50%', '40%'],
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
