<template>
  <div class="detail-container">
    <div style="margin-top: 20px; overflow: hidden;">
      <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
      <h4 class="title">{{ info.consignee ? info.consignee : '当前用户无' }}&nbsp;用户订单</h4>
      <router-link :to="{ path: '/ordermanage' }">
        <el-button style="float: right;" size="medium" icon="el-icon-back">返回</el-button>
      </router-link>
    </div>
    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">订单编号</el-col>
        <el-col :span="4" class="table-cell-title">订单创建时间</el-col>
        <el-col :span="4" class="table-cell-title">支付时间</el-col>
        <el-col :span="4" class="table-cell-title">支付状态</el-col>
        <el-col :span="4" class="table-cell-title">订单状态</el-col>
        <el-col :span="4" class="table-cell-title">商品数量</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{info.orderNo}}</el-col>
        <el-col :span="4" class="table-cell">{{info.createTime }}</el-col>
        <el-col :span="4" class="table-cell">{{info.payTime || "未支付"}}</el-col>
        <el-col :span="4" class="table-cell">{{info.payStatus | payStatusFormat }}</el-col>
        <el-col :span="4" class="table-cell">{{info.orderStatus | orderStatusCharacter }}</el-col>
        <el-col :span="4" class="table-cell">{{ info.orderDetailInfos | orderNumsFormat }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-cell-title">订单金额</el-col>
        <el-col :span="2" class="table-cell-title">支付金额</el-col>
        <el-col :span="8" class="table-cell-title">收货地址</el-col>
        <el-col :span="4" class="table-cell-title">联系手机号</el-col>
        <el-col :span="4" class="table-cell-title">卡劵折扣金额</el-col>
        <el-col :span="4" class="table-cell-title">订单件数</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-cell">{{info.totalAmount}}</el-col>
        <el-col :span="2" class="table-cell">{{info.payAmount }}</el-col>
        <el-col :span="8" class="table-cell">{{info.consigneeAddress}}</el-col>
        <el-col :span="4" class="table-cell">{{info.consigneeMobile}}</el-col>
        <el-col :span="4" class="table-cell">{{info.couponAmount}}</el-col>
        <el-col :span="4" class="table-cell">{{info.numTotal}}</el-col>
      </el-row>
      <div style="margin-top: 20px">
        <svgIcon icon-class="marker" style="color: #606266"></svgIcon>
        <span class="font-small">商品</span>
      </div>
      <el-table ref="orderItemTable" :data="mock" style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品号" align="center" prop="orderDetailId"></el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.itemImg" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" width="200" prop="itemName"></el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>
              价格：
              <span style="color: orange;">￥{{scope.row.itemPrice}}</span>
            </p>
            <p>货号：{{scope.row.itemId }}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">{{scope.row.itemNum }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.createdTime }}</template>
        </el-table-column>
        <el-table-column label="支付金额" width="120" align="center">
          <template slot-scope="scope">{{`${scope.row.itemPrice} * ${scope.row.itemNum}`}}</template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.itemNum * scope.row.itemPrice}}</template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：
        <span class="highlight-font">￥{{info.totalAmount}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import svgIcon from './../../components/svgIcon'
export default {
  data () {
    return {
      info: {},
      mock: []
    }
  },
  created () {
    if (this.$route.query.id === undefined) {
      return this.$router.back(-1)
    }
    this.$http.orderManage.infoTop(this.$route.query.id).then(
      res => {
        this.info = res.data.data
      },
      err => {
        this.$message({
          type: 'error',
          message: err.data.message
        })
      }
    )
    this.$http.orderManage.infoDowm(this.$route.query.id).then(
      res => {
        this.mock = res.data.data
      },
      err => {
        this.$message({
          type: 'error',
          message: err.data.message
        })
      }
    )
  },
  filters: {
    orderNumsFormat (val) {
      return val instanceof Array ? val.length : '暂无'
    },
    payStatusFormat (payStatus) {
      return payStatus === '1' ? '已支付' : '未支付'
    },
    orderStatusCharacter (orderStatusCode) {
      if (orderStatusCode === '0') {
        return '订单正在交易'
      } else if (orderStatusCode === '1') {
        return '订单交易完成'
      } else if (orderStatusCode === '2') {
        return '订单交易取消'
      } else if (orderStatusCode === '3') {
        return '订单退货'
      }
    }
  },
  components: {
    svgIcon
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 20px 20px 20px 20px;
  background: white;
  .font-small {
    font-size: 22px;
    font-weight: 400;
  }
}

.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-bottom: orange 1px solid;
  border-top: 1px solid #dcdfe6;
  overflow: hidden;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
