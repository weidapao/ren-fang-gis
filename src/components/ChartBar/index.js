import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import styles from './index.less';

export default class ChartBar extends React.Component {
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
          right: 24,
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
          data: [],
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
            data: [],
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

  shouldComponentUpdate(nextProps, nextState) {
    let isRerender = false
    if(this.props.data.length!==nextProps.data.length){
      return true
    }
    nextProps.data.map((item,index)=>{
      if(item.name!==this.props.data[index].name||item.value!==this.props.data[index].value){
        isRerender = true
      }
    })
    return isRerender
  }
  render() {
    let onEvents={
      click:e=>{
        this.props.onClick(e)
      }
    }
    const option ={
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
        right: 24,
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
    }
    return (
      <div style={{ height: '100%' }}>
        <ReactEcharts
          style={{ width: '100%', height: '100%' }}
          notMerge={true}
          option={option}
          lazyUpdate={true}
          onEvents={onEvents}
        />
      </div>
    );
  }
}
