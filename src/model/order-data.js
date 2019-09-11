/**
 *
 * @param {*} myChart
 */
function orderProductData (myChart) {
  var option = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source: [
        ['product', '2019-8-28', '2019-8-29', '2019-8-30', '2019-8-31', '2019-9-1', '2019-9-2'],
        ['进行中订单', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
        ['已完成订单', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
        ['取消的订单', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
        ['退货的订单', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
      ]
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      gridIndex: 0
    },
    grid: {
      top: '55%'
    },
    series: [{
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row'
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row'
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row'
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row'
    },
    {
      type: 'pie',
      id: 'pie',
      radius: '30%',
      center: ['50%', '25%'],
      label: {
        formatter: '{b}: {@2019-8-28} ({d}%)'
      },
      encode: {
        itemName: 'product',
        value: '2019-8-28',
        tooltip: '2019-8-28'
      }
    }
    ]
  }

  myChart.on('updateAxisPointer', function (event) {
    var xAxisInfo = event.axesInfo[0]
    if (xAxisInfo) {
      var dimension = xAxisInfo.value + 1
      myChart.setOption({
        series: {
          id: 'pie',
          label: {
            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
          },
          encode: {
            value: dimension,
            tooltip: dimension
          }
        }
      })
    }
  })
  return option
}

export {
  orderProductData
}
