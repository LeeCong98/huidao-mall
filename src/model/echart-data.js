import echarts from 'echarts'

function userCreateData (category, lineData, barData, percentage) {
  var option = null
  // option
  option = {
    backgroundColor: '#0f375f',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['用户注册量', '当前订单数量'],
      textStyle: {
        color: '#ccc'
      }
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      }
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      }
    },
    series: [{
      name: '订单比',
      type: 'line',
      smooth: true,
      showAllSymbol: true,
      symbol: 'emptyCircle',
      symbolSize: 15,
      data: percentage
    }, {
      name: '用户注册量',
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          barBorderRadius: 5,
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [{
              offset: 0,
              color: '#14c8d4'
            },
            {
              offset: 1,
              color: '#43eec6'
            }
            ]
          )
        }
      },
      data: barData
    }, {
      name: '当前订单数量',
      type: 'bar',
      barGap: '-100%',
      barWidth: 10,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [{
              offset: 0,
              color: 'rgba(20,200,212,0.5)'
            },
            {
              offset: 0.2,
              color: 'rgba(20,200,212,0.2)'
            },
            {
              offset: 1,
              color: 'rgba(20,200,212,0)'
            }
            ]
          )
        }
      },
      z: -12,
      data: lineData
    }]
  }
  return option
}

export {
  userCreateData
}
