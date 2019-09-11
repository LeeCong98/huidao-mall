<template>
  <div class="root-container cardManage">
    <Headline title="卡券管理" label="卡券张数">
      <el-button class="add-button" @click="toAddNewCard" type="danger">发布卡劵</el-button>
    </Headline>
    <Search :inputArr="inputArr" @to-search="searchCardByNameOrStatus">
      <div class="search-group">
        <div class="search-item">
          <em class="select-label">{{ options.label }}：</em>
          <el-select v-model="condition[0]">
            <el-option
              v-for="unit in options.select"
              :key="unit.label"
              :label="unit.label"
              :value="unit.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </Search>
    <listPanel class="grap" title="卡劵信息">
      <el-table
        :data="tableData"
        header-align="center"
        class="table-container"
        :row-style="{ height: '164px' }"
        :style="{ width: '100%' }"
      >
        <el-table-column align="center" prop="ticketId" label="卡劵ID"></el-table-column>
        <el-table-column align="center" prop="createdBy" label="用户名"></el-table-column>
        <el-table-column align="center" prop="ticketRule" label="规则">
          <template slot-scope="lineData">
            <span>{{ lineData.row.ticketRule | characterRules }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ticketNum" label="发劵数量"></el-table-column>
        <el-table-column align="center" prop="ticketTitle" label="优惠内容"></el-table-column>
        <el-table-column align="center" prop="preferentialFee" label="卡劵金额"></el-table-column>
        <el-table-column align="center" prop="ticketStatus" label="状态">
          <template slot-scope="lineData">
            <span>{{ lineData.row.ticketStatus | cardStatusUse }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createdTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="opeartion-container">
              <el-button
                type="info"
                size="mini"
                :disabled="scope.row.ticketStatus === 'Y'"
                @click="toEditPage(scope.row.ticketId, scope.row.ticketStatus, 'Y', scope.$index)"
              >编辑</el-button>
              <el-button
                type="success"
                size="mini"
                :disabled="scope.row.ticketStatus === 'Y'"
                @click="changeStatus(scope.row.ticketId, 'Y', scope.$index)"
              >开启</el-button>
              <el-button
                type="warning"
                size="mini"
                :disabled="scope.row.ticketStatus === 'N'"
                @click="changeStatus(scope.row.ticketId, 'J', scope.$index)"
              >禁用</el-button>
              <el-button
                type="danger"
                size="mini"
                :disabled="scope.row.ticketStatus === 'Y'"
                @click="removeCard(scope.row.ticketId, scope.row.ticketStatus, scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </listPanel>
    <Pageinate :total="total" :pageSize="pageSize" :receive="true" @receiveCurrent="getCurentPage" />
  </div>
</template>

<script>
import Headline from '../../components/headline.vue'
import Search from '../../components/search.vue'
import listPanel from '../../components/list.vue'
import { selectMenu } from './../../model/cardManage'
import Pageinate from '../../components/paginate.vue'
import cardModel from './../../Http/cardManage/index'
import { alertInfo } from '../../assets/js/common'
let isEmpty = function (val) {
  if (typeof val === 'string' && val.length !== 0) return true
  return false
}
selectMenu[0].select.unshift(
  {
    label: '请选择状态',
    value: ''
  },
  {
    label: '已禁用',
    value: 'J'
  }
)
let options = selectMenu[0]
export default {
  components: {
    Headline,
    Search,
    listPanel,
    Pageinate
  },
  data () {
    return {
      options: options,
      // 默认值为第一个选项，选项数据在assets/model/cardManage.js中
      condition: [''],
      inputArr: ['请输入用户名'],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      // 是否为搜索模式
      mode: 'list'
    }
  },
  methods: {
    // 改变状态；
    changeStatus (cardId, modifyStatus, index) {
      if (this.tableData[index].ticketStatus === modifyStatus) {
        return alertInfo.call(this, {
          type: 'error',
          cont: '已是该状态，无需更改'
        })
      } else {
        cardModel.changeCardStatus(
          {
            id: cardId,
            ticketStatus: modifyStatus
          },
          () => {
            alertInfo.call(this, { type: 'success', cont: '更改成功' })
            this.tableData[index].ticketStatus = modifyStatus
          },
          ({ data: { message = '更改失败' } }) => {
            alertInfo.call(this, { type: 'error', cont: message })
          }
        )
      }
    },
    searchCardByNameOrStatus ({ input }, current = 1) {
      if (isEmpty(input[0]) || isEmpty(this.condition[0])) {
        this.mode = 'search'
        this.SearchInner = input.length > 0 ? input[0] : null
        cardModel.getByNameOrStatus(
          {
            ticketStatus:
              this.condition[0].length > 0 ? this.condition[0] : null,
            createdBy: this.SearchInner,
            size: this.pageSize,
            current
          },
          ({ data: { data } }) => {
            this.total = data.ticketCount
            this.tableData = data.ticketRecords
          },
          () => {
            this.tableData = []
            this.total = 0
            alertInfo.call(this, {
              type: 'error',
              cont: '没有找到相关的卡劵'
            })
          }
        )
      } else {
        this.mode = 'list'
        this.getCurentPage({ currentPage: 1 })
      }
    },
    // 跳转到新增页面
    toAddNewCard () {
      this.$router.push({
        path: '/newCardCustomer'
      })
    },
    // 事件函数
    getCurentPage (val) {
      if (val.currentPage === undefined || val.currentPage === null) {
        return false
      }
      if (this.mode === 'search') {
        this.searchCardByNameOrStatus(
          { input: this.SearchInner },
          val.currentPage
        )
      } else {
        this.getCardList(val.currentPage, this.pageSize)
      }
    },
    removeCard (id, status, offset) {
      if (status === 'Y') {
        return alertInfo.call(this, {
          type: 'error',
          cont: '请先禁用该卡劵再删除'
        })
      } else {
        cardModel.removeCardById(
          {
            id: id
          },
          () => {
            alertInfo.call(this, {
              type: 'success',
              cont: '删除卡劵成功'
            })
            this.tableData.splice(offset, 1)
            this.total = this.tableData.length
          },
          data => {
            alertInfo.call(this, {
              type: 'error',
              cont: '删除卡劵失败'
            })
          }
        )
      }
    },
    toEditPage (id, status, offset) {
      if (status !== 'Y') {
        this.$router.push({
          path: '/cardInfoedit',
          query: {
            id: id
          }
        })
      } else {
        alertInfo.call(this, {
          type: 'error',
          cont: '卡劵依然处理启用状态，请先启用该卡劵！'
        })
      }
    },
    // 组件函数
    getCardList (current, pageSize) {
      cardModel.getCardByPageSize(
        {
          current: current,
          size: pageSize
        },
        ({ data: { data } }) => {
          this.total = data.count
          this.tableData = data.ticketInfo
        },
        () => {}
      )
    },
    pageDataInit () {
      this.getCardList(this.current, this.pageSize)
    }
  },
  created () {
    this.pageDataInit()
  },
  filters: {
    cardStatusUse (val) {
      if (val === 'J') {
        return '已禁用'
      } else if (val === 'Y') {
        return '已启用'
      }
      return '已过期'
    },
    characterRules (val) {
      if (val !== undefined && val !== null) {
        let ruleArr = val.split(',')
        return '满' + ruleArr[0] + '减' + ruleArr[1]
      } else {
        return '暂无'
      }
    }
  }
}
</script>
