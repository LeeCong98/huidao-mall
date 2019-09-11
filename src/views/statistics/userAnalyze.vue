<template>
  <div class="userAnalyze root-container">
    <Headline title="用户分析" label="用户增长" :line="true"></Headline>
    <listPanel class="grap" title="数据增长汇报">
      <div class="echart-container">
        <v-chart :options="polar" class="userEchart" />
      </div>
    </listPanel>
  </div>
</template>

<script>
import Headline from '../../components/headline.vue'
import listPanel from '../../components/list.vue'
import { userCreateData } from '../../model/echart-data'
import ChartModel from './../../Http/statistics/userAnalyze/userAnalyze'
import { alertInfo, datetimeFormat } from '../../assets/js/common'

export default {
  data () {
    return {
      polar: null
    }
  },
  methods: {
    // 图表绘制初始化
    pageDataInit () {},
    getOrderData () {
      let category = []
      var barData = []
      let lineData = []
      let percentage = []
      ChartModel.getUserAndOrderData(
        datetimeFormat(),
        ({ data: { data } }) => {
          data.map((item, index) => {
            category.push(item.date)
            barData.push(parseInt(item.user_nums))
            lineData.push(parseInt(item.order_nums))
            if (item.user_nums === 0) {
              percentage.push(item.order_nums)
            } else {
              percentage.push((item.order_nums / item.user_nums).toFixed(2))
            }
          })
          this.polar = userCreateData(category, lineData, barData, percentage)
        },
        ({ message = '获取数据失败' }) => {
          alertInfo.call(this, {
            type: 'error',
            cont: '获取数据失败'
          })
        }
      )
    }
  },
  components: {
    Headline,
    listPanel
  },
  mounted () {
    this.getOrderData()
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.userAnalyze {
  overflow: hidden;
  .el-collapse-item {
    margin-top: 20px;
  }
  .userEchart {
    width: 100%;
    height: 600px;
  }
}
</style>
