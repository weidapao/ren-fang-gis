import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from "./index.less";

export default class ChartLines extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {},
      data: null,
      color: [
        '#1EB980',
        '#045D56',
        '#FF6859',
        '#FFCF44',
        '#0182FB',
        '#72DEFF',
        '#FB9595',
        '#19E8F2',
        '#8DA6A7',
      ],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data && nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
      };
    }
    if (nextProps.color && nextProps.color !== prevState.color) {
      return {
        color: nextProps.color,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.data && prevState.data !== this.state.data) {
      this.setState({
        option: {
          title: {
            text: this.props.title,
            textStyle: {
              color: 'white',
            },
          },
          color: [
            '#10CEF0',
            '#8A69FF',
            '#FF6859',
            '#FFCF44',
            '#0182FB',
            '#1EB980',
            '#FF9602',
          ],
          legend: {
            orient: 'vertical',
            right: 10,
            data: ['换新', '新增'],
            textStyle: {
              color: 'white',
            },
          },
          color: this.state.color,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: '#40AAF5',
                width: 1,
                type: 'solid',
              },
            },
          },
          grid: this.props.dataZoom
            ? {
                left: '48',
                right: '36',
                bottom: '72',
                top: '42',
              }
            : {
                left: '48',
                right: '36',
                bottom: '36',
                top: '42',
              },
          dataZoom: this.props.dataZoom
            ? [
                {
                  type: 'slider',
                  handleIcon:
                    'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                  start: 75,
                  end: 100,
                  bottom: 4,
                  height: 20,
                  showDetail: false,
                  xAxisIndex: [0],
                  filterMode: 'filter',
                  minValueSpan: 1000 * 60 * 10, //十分钟
                },
              ]
            : null,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.props.data.map(item => item.year).reverse(),
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: 'white',
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: 'white',
              },
            },
          },
          series: [
            {
              name: '换新',
              type: 'line',
              stack: '总量',
              data: this.props.data.map(item => item.num),
              itemStyle: {
                color: 'red',
              },
            },
            {
              name: '新增',
              type: 'line',
              stack: '总量',
              data: this.props.data2.map(item => item.num),
              itemStyle: {
                color: 'yellow',
              },
            },
          ],
          tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
              return `${params.name}：${params.value}，环比：${
                this.props.data[params.dataIndex].huanbi
              }%`;
            },
          },
        },
      });
    }
  }
  render() {
    return (
      <div style={{ height: '100%' }}>
        <ReactEcharts
          notMerge={true}
          option={this.state.option}
          lazyUpdate={true}
          style={{ width: '100%', height: '150px' }}
        />
      </div>
    );
  }
}
