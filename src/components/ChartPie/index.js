import React from "react";
import ReactEcharts from "echarts-for-react";

export default class ChartTodayEvent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: {},
      highlightLoop: true,
      data: null
    };
  }

  highlightLoop = index => {
    if (this.state.data) {
      if (index >= this.state.data.length) {
        index = 0;
      }
      let sum = this.state.data[index].value;
      if (sum <= 0) {
        return setTimeout(() => {
          this.highlightLoop(++index);
        }, 100);
      }
      if (this.echarts_react) {
        this.state.data.map((current, i) => {
          this.echarts_react.getEchartsInstance().dispatchAction({
            type: 'downplay',
            seriesName: 'pie',
            dataIndex: i
          });
        });
        this.echarts_react.getEchartsInstance().dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        });
      }
    }
    if (this.state.highlightLoop) {
      return setTimeout(() => {
        this.highlightLoop(++index);
      }, 2000);
    }
  };
  componentDidMount() {
    this.highlightLoop(0);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data && nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    }
    return null;
  }

  formatData = (res) => {
    let formatData = res.map(v => {
      return {
        name: v.legend,
        value: v.line.reduce((prev, next) => Number(prev) + Number(next), 0)
      };
    }).sort((a, b) => b.value - a.value);
    if (formatData.length > 6) {
      return {
        baseList: formatData,
        frontList: formatData.slice(0, 6),
        overList: formatData.slice(6),
        otherList: [{
          name: '其他',
          value: formatData.slice(6).reduce((prev, next) => {
            return prev + next.value;
          }, 0)
        }]
      };
    } else {
      return {
        baseList: formatData,
        frontList: formatData,
        overList: [],
        otherList: []
      };
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data && prevState.data !== this.state.data) {
      this.setState({
        option: {
          title: {
            text: '老化程度分析',
            textStyle: {
              color: 'white',
            }
          },
          color: [
            "#10CEF0",
            "#8A69FF",
            "#FF6859",
            "#FFCF44",
            "#0182FB",
            "#1EB980",
            "#FF9602",

          ],
          tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
              if (params.name === '其他') {
                let str = '';
                overList.map(item => {
                  str +=
                    sum
                      ? `${item.name}：${item.value}起，占比：${(item.value * 100 / sum).toFixed(2)}% <br/>`
                      : `${item.name}：${item.value}起，占比：0% <br/>`;
                });
                return str;
              } else {
                return `${params.name}：${params.value}起，占比：${params.percent}%`;
              }
            }
          },
          grid: {
            // top: 24,
            // right: 0,
            // bottom: 24,
            // left: 0
          },
          legend: {
            show: true,
            top: "24",
            right: "10",
            width: "24",
            orient: "vertical",
            formatter: "{name}",
            data: this.state.data.map(e => {
              return {
                name: e.name,
                icon: 'circle'
              };
            }),
            textStyle: {
              color: "white"
            },
            selectedMode: false
          },
          series: [
            {
              name: "pie",
              type: "pie",
              radius: ["38%", "42%"],
              center: ["25%", "52%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  color: "white",
                  position: "center",
                  formatter: "{c}起"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: this.state.data
            }
          ]
        }
      });
    }
  }
  render() {
    let onEvents = {
      'mouseover': e => {
        this.state.data.map((current, i) => {
          this.echarts_react.getEchartsInstance().dispatchAction({
            type: "downplay",
            seriesName: "pie",
            dataIndex: i
          });
        })
        this.echarts_react.getEchartsInstance().dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex
        });
      },
    }
    return (
      <div style={{height:'100%'}}>
        <ReactEcharts
          notMerge={true}
          option={this.state.option}
          lazyUpdate={true}
          ref={e => {
            this.echarts_react = e;
          }}
          style={{ width: "100%", height: "160px" }}
          onEvents = { onEvents }
        />
      </div>
    );
  }
  componentWillUnmount() {
    this.setState({
      highlightLoop: false
    });
  }
}
