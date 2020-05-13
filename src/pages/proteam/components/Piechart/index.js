import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class RadarChart extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {
        title: {
          text: '专业队人数分析',
          textStyle: {
            color: 'white',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '人数',
            type: 'pie',
            radius: '45%',
            center: ['50%', '50%'],
            data: [
              { name: '通信专业队', value: 12 },
              { name: '治安专业队', value: 3 },
              { name: '消防专业队', value: 4 },
              { name: '心理防护专业队', value: 8 },
              { name: '其他', value: 8 },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
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
            text: '专业队人数分析',
            textStyle: {
              color: 'white',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          series: [
            {
              name: '姓名',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: [
                { name: '测试', value: 12 },
                { name: '测2试', value: 12 },
                { name: '测33试', value: 12 },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
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
