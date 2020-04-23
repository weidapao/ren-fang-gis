import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class ChartBar extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      option: {
        title: {
          subtextStyle: {
            fontSize: '14',
            color: 'white'
          },
          textStyle: {
            color: 'white',
            fontWeight: 900,
          },
        },
        grid: {
          top: 0,
          right: 20,
          bottom: 24,
          left: 50,
        },
        xAxis: {
          show:false,
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick:{
            show:false
          }
        },
        yAxis: {
          type: 'category',
          data: ['南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市', '南京市'],
          axisLabel: { interval: 0 },
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          axisTick: {
            show: false,
            // alignWithLabel: true,
            lineStyle: {
              color: "white"
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '通行量',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              color: 'white',
            },
            data: [10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330],
            barWidth: 12,
            barGap:'10%',
            itemStyle: {
              color: '#FEB300',
              borderColor: '#fff',
              borderWidth: 0,
              borderType: 'solid',
              barBorderRadius: 10,
            },
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
            subtextStyle: {
              fontSize: '14',
            },
            textStyle: {
              color: 'white',
              fontWeight: 900,
            },
          },
          grid: {
            top: 0,
            right: 20,
            bottom: 24,
            left: 60,
          },
          xAxis: {
            show:false,
            type: 'value',
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick:{
              show:false
            }
          },
          yAxis: {
            type: 'category',
            data: this.props.data.map(item=>item.name).reverse(),
            axisLabel: { interval: 0 },
            axisLine: {
              show: false,
              lineStyle: {
                color: "white"
              }
            },
            axisTick: {
              show: false,
              // alignWithLabel: true,
              lineStyle: {
                color: "white"
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '通行量',
              type: 'bar',
              label: {
                show: true,
                position: 'right',
                color: 'white',
              },
              data: this.props.data.map(item=>item.value).reverse(),
              barWidth: 12,
              barGap:'10%',
              itemStyle: {
                color: '#FEB300',
                borderColor: '#fff',
                borderWidth: 0,
                borderType: 'solid',
                barBorderRadius: 10,
              },
            },
          ],
        },
      });
    }
  }
  render() {
    let onEvents={
      click:e=>{
        this.props.onClick(e)
      }
    }
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
