<template>
  <div class="account root-container">
    <Headline class="border" title="账户管理" label="账户列表" :middleLine="true">
      <!-- <el-button type="text" class="right" style="color: blue;">
        <router-link tag="div" :to="{name: 'accountAdd'}">新增用户</router-link>
      </el-button>-->
    </Headline>
    <List class="list" title="账户信息">
      <el-table
        :data="mock"
        :row-style="table"
        :row-class-name="tableRowClassName"
        style="width: 100%;"
      >
        <el-table-column align="center" label="用户名" label-class-name="ls-label">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" label-class-name="ls-label">
          <template slot-scope="scope">
            <span>{{scope.row.sysRoleNickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label-class-name="ls-label" label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label-class-name="ls-label" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="Y"
              inactive-value="N"
              @change="handleToogle(scope.$index, scope.row)"
              active-color="blue"
              inactive-color="#ccc"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label-class-name="ls-label" label="操作">
          <template slot-scope="scope" v-if="scope.$index !== 0">
            <el-button
              type="text"
              style="color: red;"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              style="color: blue;"
              @click="handleUpdate(scope.$index, scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </List>
  </div>
</template>

<script>
import Headline from '../../../components/headline.vue'
import List from '../../../components/list.vue'
import { remove } from '../../../assets/js/common'
export default {
  data () {
    return {
      table: {
        height: '164px'
      },
      mock: []
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'warning-row'
      }
      return ''
    },
    handleToogle (index, item) {
      let status = item.status
      this.$http.Account.updateStatus(item.userId, status).then(
        res => {
          this.mock[index].status = status
        },
        (err) => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
          item.status = status === 'Y' ? 'N' : 'Y'
        }
      )
    },
    // 删除一项
    handleDelete (index, item) {
      if (item.status === 'Y') {
        this.$message({
          type: 'error',
          message: '只能删除禁用状态下的用户'
        })
        return
      }
      remove.call(this, () => {
        this.$http.Account.delete(item.userId).then(
          res => {
            this.mock.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
              lockScroll: false
            })
          },
          (err) => {
            this.$message({
              type: 'error',
              message: err.data.message
            })
          }
        )
      })
    },
    // 跳转到修改页
    handleUpdate (index, item) {
      this.$router.push({
        name: 'accountUpdate',
        params: { id: item.userId, role: item.sysRoleNickname }
      })
    }
  },
  created () {
    // 获取所有的数据
    this.$http.Account.getAll().then(
      res => {
        this.mock = res.data.data.records
        const admin = this.mock.filter(item => {
          return item.sysRoleNickname === '超级管理员'
        })
        this.mock.splice(this.mock.indexOf(admin[0]), 1)
        this.mock.unshift(admin[0])
      },
      (err) => {
        this.$message({
          type: 'error',
          message: err.data.message
        })
      }
    )
  },
  components: {
    Headline,
    List
  }
}
</script>

<style lang="scss">
.account {
  .list {
    padding: 0 11px 0 18px;
    .el-table .warning-row {
      background: oldlace;
    }
  }
}
</style>
