<template>
  <div class="orderAnalyze root-container">
    <Headline title="订单分析" label="订单数据" :line="true"></Headline>
    <listPanel class="grap" title="订单数据汇报">
      <div class="echart-container">
        <v-chart :options="orderData" class="orderEchart" :auto-resize="true" />
      </div>
    </listPanel>
  </div>
</template>

<script>
import Headline from '../../components/headline.vue'
import listPanel from '../../components/list.vue'
import { orderProductData } from '../../model/order-data'
import echarts from 'echarts'
import ChartModel from './../../Http/statistics/userAnalyze/userAnalyze'
export default {
  data () {
    return {
      orderData: null
    }
  },
  methods: {
    getUserOrderData () {
      ChartModel.getOrderData()
    },
    // 图表绘制初始化
    pageDataInit () {
      var dom = document.getElementsByClassName('orderEchart')[0]
      var myChart = echarts.init(dom)

      this.orderData = orderProductData(myChart)
    }
  },
  components: {
    Headline,
    listPanel
  },
  created () {
    //  数据融合
    // Generate data
  },
  mounted () {
    this.pageDataInit()
  }
}
</script>

<style lang="scss" scoped>
.orderAnalyze {
  padding: 0 14px;
  overflow: hidden;
  .orderEchart {
    width: 100%;
    height: 600px;
  }
}
</style>
