<template>
  <div class="orderManage root-container">
    <Search :inputArr="['请输入订单编号']" @to-search="search">
      <div class="searchItem search-group">
        <el-row type="flex" class="row-bg">
          <el-col :span="9" :offset="1">
            <el-date-picker
              style="width: 100%"
              v-model="grapTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
            ></el-date-picker>
          </el-col>
          <el-col :span="9" :offset="2">
            <div class="search-item">
              <em class="select-label">{{ selectMenu.label }}</em>
              <el-select class="select" v-model="value">
                <el-option
                  v-for="unit in selectMenu.select"
                  :key="unit.label"
                  :label="unit.label"
                  :value="unit.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
    </Search>
    <Panel title="订单信息">
      <div>
        <el-table :data="dataTable" :row-style="table" style="width: 100%;padding: 0 12px;">
          <el-table-column
            width="130"
            prop="orderNo"
            align="center"
            label="订单编号"
            label-class-name="ls-label"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="numTotal"
            align="center"
            label="件数"
            label-class-name="ls-label"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="consignee"
            align="center"
            label-class-name="ls-label"
            label="收件人"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="consigneeMobile"
            align="center"
            label-class-name="ls-label"
            label="联系方式"
          ></el-table-column>
          <el-table-column
            prop="consigneeAddress"
            align="center"
            label-class-name="ls-label"
            label="收货地址"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="totalAmount"
            align="center"
            label-class-name="ls-label"
            label="合计价格"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="payAmount"
            align="center"
            label-class-name="ls-label"
            label="实付金额"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="createTime"
            align="center"
            label-class-name="ls-label"
            label="建立时间"
          ></el-table-column>
          <el-table-column
            width="130"
            prop="payTime"
            align="center"
            label-class-name="ls-label"
            label="付款时间"
          ></el-table-column>
          <el-table-column width="130" align="center" label-class-name="ls-label" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.payStatus === '0' ? '未付款':'已付款'}}</span>
            </template>
          </el-table-column>
          <el-table-column width="130" align="center" label-class-name="ls-label" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleTo(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Paginate
          class="paginate"
          :total="total"
          :pageSize="pageSize"
          @receiveCurrent="onChangePage"
        ></Paginate>
      </div>
    </Panel>
  </div>
</template>

<script>
import Panel from '../../components/panel.vue'
import Search from '../../components/search.vue'
import Paginate from '../../components/paginate.vue'
import { alertInfo } from '../../assets/js/common'
export default {
  data () {
    return {
      table: {
        height: '164px'
      },
      pageSize: 5,
      total: 0,
      selectMenu: {
        label: '状态',
        select: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '未支付'
          },
          {
            value: 1,
            label: '已支付'
          }
        ]
      },
      value: -1,
      dataTable: [],
      searchTirm: {},
      grapTime: []
    }
  },
  created () {
    this.getAll(1)
  },
  methods: {
    // 页码改变重新获取数据
    onChangePage ({ currentPage }) {
      if (Object.keys(this.searchTirm).length !== 0) {
        this.getSearchData(currentPage, this.pageSize)
        return
      }
      this.getAll(currentPage)
    },
    // 跳转到详情页
    handleTo (index, item) {
      this.$router.push({
        name: 'orderManageInfo',
        query: { id: item.orderId }
      })
    },
    // 获取所有数据
    getAll (page) {
      this.$http.orderManage.getAll(page, this.pageSize).then(
        res => {
          this.dataTable = res.data.data.orderInfo
          this.total = res.data.data.count
        },
        err => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        }
      )
    },
    // 搜索按钮的功能
    search ({ input }) {
      let querys = {}
      if (
        (input.length === 0 || input[0] === '') &&
        (this.grapTime === null || this.grapTime.length === 0) &&
        this.value === -1
      ) {
        this.total = 1
        this.searchTirm = {}
        this.getAll(1)
        return
      }
      if (typeof input[0] === 'string' && input[0].trim() !== '') {
        querys.orderNo = input[0].trim()
      }
      if (this.value !== -1) {
        querys.payStatus = this.value
      }
      this.searchTirm = querys
      this.searchTirm.startTime = this.grapTime[0]
      this.searchTirm.endTime = this.grapTime[1]
      this.getSearchData(1, this.pageSize)
    },
    getSearchData (page, size) {
      this.searchTirm.current = page
      this.searchTirm.size = size
      this.$http.orderManage
        .search(this.searchTirm)
        .then(
          res => {
            this.total = res.data.data.count
            let data = res.data.data.orderInfo
            if (data.length < 1) {
              this.dataTable = []
              alertInfo.call(this, {
                type: 'error',
                cont: '没有查询到相关的数据!'
              })
            } else {
              this.dataTable = data
            }
          },
          err => {
            this.$message({
              type: 'error',
              message: err.data.message
            })
          }
        )
        .catch(() => {
          alertInfo.call(this, {
            type: 'error',
            cont: '订单查询失败'
          })
        })
    }
  },
  components: {
    Panel,
    Search,
    Paginate
  }
}
</script>

<style lang="scss" scoped>
.orderManage {
  .row-bg {
    align-items: center;
    width: 100%;
  }
  .searchItem {
    width: 60%;
  }
  .paginate {
    margin: 63px 0;
    float: right;
    margin-right: 135px;
  }
}
</style>
