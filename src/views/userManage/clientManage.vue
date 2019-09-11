<template>
  <div class="root-container clientManage">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input
              :min="11"
              :max="11"
              style="width: 203px"
              v-model.number="listQuery.mobile"
              placeholder="客户手机"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <listPanel title="活动列表" class="grap cont-container">
      <el-table
        :style="{ width: '100%' }"
        :data="tableData"
        :row-style="{ height: '164px' }"
        header-align="center"
        class="table-container"
        :empty-text="emptyText"
      >
        <el-table-column align="center" prop="avatar" label="用户头像" width="150">
          <template slot-scope="scope">
            <img style="width: 100%;height: 100%;" :src="scope.row.img" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cLoginName" label="昵称"></el-table-column>
        <el-table-column align="center" prop="orderList" label="订单数">
          <template slot-scope="scope">
            <span>{{ scope.row.orderList.length }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sex" label="性别"></el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
        <el-table-column align="center" prop="ticketList" label="优惠券拥有数">
          <template slot-scope="scope">
            <span>{{ scope.row.ticketList.length }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="用户状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status === "Y" ? "正常" : "禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="注册时间"></el-table-column>
        <el-table-column align="center" label="操作" width="150" class-name="user-operations">
          <template slot-scope="scope">
            <el-button
              @click="findUserOrder(scope.$index, scope.row)"
              size="mini"
              :disabled="scope.row.orderList | isDisabeld "
              round
            >查看订单</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" round>修改资料</el-button>
            <el-button
              :type="scope.row.status === 'Y' ? 'danger' : ''"
              @click="handleDisable(scope.$index, scope.row)"
              size="mini"
              round
            >{{scope.row.status === 'Y' ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </listPanel>
    <Pageinate :total="total" :pageSize="pageSize" :receive="true" @receiveCurrent="getCurentPage" />
  </div>
</template>

<script>
import listPanel from '../../components/list.vue'
import Guest from './../../Http/userManage/clientManage/clientManage'
import Pageinate from '../../components/paginate.vue'
import { alertInfo } from '../../assets/js/common'
var guest = new Guest()
export default {
  data () {
    return {
      tableData: [],
      listQuery: {
        mobile: ''
      },
      emptyText: '该条件下无用户',
      total: 0,
      pageSize: 10
    }
  },
  components: {
    listPanel,
    Pageinate
  },
  methods: {
    handleResetSearch () {
      this.listQuery.mobile = ''
    },
    handleEdit (index, row) {
      if (row.cId !== undefined) {
        this.$router.push({
          path: '/clientManageEdit',
          query: {
            id: row.cId
          }
        })
      }
    },
    findUserOrder (offset, lineData) {
      if (lineData.orderList.length < 1 || lineData.cId === undefined) {
        alertInfo.call(this, {
          type: 'warning',
          cont: '该用户暂时没有订单！'
        })
      } else {
        this.$router.push({
          path: '/userOrder',
          query: {
            userId: lineData.cId
          }
        })
      }
    },
    handleDisable (index, item) {
      if (item.cId !== undefined) {
        let newStatus = item.status === 'Y' ? 'N' : 'Y'
        guest.updateStatus(
          {
            cId: item.cId,
            status: newStatus
          },
          ({ data }) => {
            this.tableData[index].status = newStatus
            alertInfo.call(this, {
              type: 'success',
              cont: '修改成功'
            })
          },
          () => {
            alertInfo.call(this, {
              type: 'error',
              cont: '修改失败'
            })
          }
        )
      } else {
        alertInfo.call(this, {
          type: 'error',
          cont: '操作失败'
        })
      }
    },
    // 点击按钮根据手机号进行搜索, 若为空字符串则为不设条件，查询失败清空表格
    handleSearchList () {
      let result = this.listQuery.mobile
      if (typeof result === 'number' && /[0-9]{11}/.test(result)) {
        guest.getByMobileGuest(
          parseInt(result),
          ({ data }) => {
            this.total = 1
            this.tableData = [data.data]
          },
          // 错误情况
          () => {
            this.tableData = []
            this.total = 0
          }
        )
      } else {
        this.pageDataInit()
      }
    },
    // 页面金数据初始化函数
    pageDataInit () {
      // 初始化 获取页面数据
      this.getCurentPage({ currentPage: 1 })
    },
    // 接收现在的页码
    getCurentPage (val) {
      if (val.currentPage === undefined) return false
      guest.getSwitchPage(
        {
          current: val.currentPage,
          size: this.pageSize
        },
        ({ data: { data } }) => {
          this.total = data.count
          this.tableData = data.customerInfoList
        }
      )
    }
  },
  // create 请求 全部 客户数据
  created () {
    this.pageDataInit()
  },
  filters: {
    isDisabeld (order) {
      return order.length === 0
    }
  }
}
</script>

<style lang="scss">
.user-operations {
  > div {
    font-size: 12px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    > button {
      margin: 60% 0px;
      margin: 8px 0px;
    }
  }
}
</style>
