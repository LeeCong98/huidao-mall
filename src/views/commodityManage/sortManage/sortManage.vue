<template>
  <div class="sortManage root-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="search" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.input" placeholder="分类名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-table :data="mock" :row-style="{height: '164px'}" style="width: 100%">
      <el-table-column align="center" label="编号" label-class-name="ls-label">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" align="center" label="分类id" label-class-name="ls-label"></el-table-column>
      <el-table-column label="分类图" align="center" label-class-name="ls-label">
        <template slot-scope="scope">
          <img :style="{width: '100%',height: '130px'}" :src="scope.row.categoryImage" alt />
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" align="center" label-class-name="ls-label" label="分类名"></el-table-column>
      <el-table-column align="center" label-class-name="ls-label" label="启用/禁用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.categoryStatus"
            active-value="Y"
            inactive-value="N"
            @change="handleToogle(scope.$index, scope.row)"
            active-color="blue"
            inactive-color="#ccc"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-button type="warning" @click="handleAdd(scope.$index, scope.row)">分类新增</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleInfo(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Paginate class="paginate" :total="total" :pageSize="pageSize" @receiveCurrent="updatePage"></Paginate>
  </div>
</template>

<script>
import Paginate from '../../../components/paginate.vue'
import { remove } from '../../../assets/js/common'
export default {
  data () {
    return {
      listQuery: {
        input: ''
      },
      pageSize: 5,
      total: 0,
      mock: []
    }
  },
  methods: {
    // 跳转到新增页
    handleAdd (index, item) {
      this.$router.push({
        name: 'sortManageAdd'
      })
    },
    handleResetSearch (forName) {
      // 重置值
      this.listQuery.input = ''
    },
    // 点击搜索按钮
    search () {
      let imValue = this.listQuery
      if (imValue.input.length === 0 || imValue.input[0] === '') {
        this.input = ''
        this.getAll()
        return
      }
      this.input = imValue.input[0]
      this.getSearch(1)
    },
    getSearch (index) {
      this.$http.sortManage.nameSearch(this.input, index, this.pageSize).then(
        res => {
          this.total = res.data.data.total
          this.mock = res.data.data.list
        },
        err => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        }
      )
    },
    // 从接口获取数据
    getAll (current = '1') {
      this.$http.sortManage.getAll(current).then(
        res => {
          this.mock = res.data.data.list
          this.total = res.data.data.total
        },
        err => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        }
      )
    },
    // 状态的切换
    handleToogle (index, item) {
      let message = '禁用成功!'
      if (item.categoryStatus === 'Y') {
        message = '启用成功!'
      }
      this.$http.sortManage.updateStatus(item.categoryId, item.categoryStatus).then(res => {
        this.mock[index].categoryStatus = item.categoryStatus
        this.$message({
          type: 'success',
          message,
          lockScroll: false
        })
      }, (err) => {
        this.$message({
          type: 'error',
          message: err.data.message,
          lockScroll: false
        })
        item.categoryStatus = item.categoryStatus === 'Y' ? 'N' : 'Y'
      })
    },
    // 删除一项
    handleDelete (index, item) {
      if (item.categoryStatus === 'Y') {
        this.$message({
          type: 'error',
          message: '只有禁用的分类才能删除'
        })
        return
      }
      remove.call(this, () => {
        this.$http.sortManage.delete(item.categoryId).then(
          res => {
            this.mock.splice(index, 1)
            this.total = this.mock.length
            this.$message({
              type: 'success',
              message: '删除成功!',
              lockScroll: false
            })
          },
          err => {
            this.$message({
              type: 'error',
              message: err.data.message
            })
          }
        )
      })
    },
    // 切换页码
    updatePage ({ currentPage }) {
      if (this.input.length !== 0) {
        this.getSearch(currentPage)
        return
      }
      this.getAll(currentPage)
    },
    // 进入编辑页面
    handleInfo (index, item) {
      if (item.categoryStatus === 'Y') {
        this.$message({
          type: 'error',
          message: '只有禁用的分类才能编辑'
        })
        return
      }
      this.$router.push({
        name: 'sortManageUpdate',
        params: { id: item.categoryId }
      })
    }
  },
  created () {
    this.getAll()
  },
  components: {
    Paginate
  }
}
</script>

<style lang="scss" scoped>
.sortManage {
  .head {
    .btn-right {
      position: absolute;
      right: 86px;
      top: 50px;
    }
  }
  .list {
    padding: 0 12px;
    overflow: hidden;
    .paginate {
      margin: 63px 0;
      float: right;
      margin-right: 135px;
    }
  }
  .btn {
    width: 112px;
    height: 42px;
    font-size: 14px;
  }
}
</style>
