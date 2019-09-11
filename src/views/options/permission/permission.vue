<template>
  <div class="permission root-container">
    <Headline title="账户权限" label="权限列表" :middleLine="true">
      <el-button type="text" class="right" style="color: red;">
        <router-link tag="div" :to="{name: 'permissionAdd'}">新增权限</router-link>
      </el-button>
    </Headline>
    <List class="list" title="权限信息">
      <el-table
        :data="mock"
        :row-style="table"
        :row-class-name="tableRowClassName"
        style="width: 100%;"
      >
        <el-table-column
          prop="sysRoleNickname"
          align="center"
          label="角色"
          label-class-name="ls-label"
        ></el-table-column>
        <el-table-column align="center" label-class-name="ls-label" label="对应权限列表">
          <template slot-scope="scope">
            <em v-for="item in scope.row.listPermission" :key="item.id">{{item.name + ' '}}</em>
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
  created () {
    this.$http.Permission.getAllRP().then(
      res => {
        this.mock = res.data.data
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
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'warning-row'
      }
      return ''
    },
    handleDelete (index, item) {
      remove.call(this, () => {
        this.$http.Permission.delete(item.sysRoleId).then(res => {
          this.mock.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
            lockScroll: false
          })
        }, (err) => {
          this.$message({
            type: 'error',
            message: err.data.message
          })
        })
      })
    },
    // 路由跳转到修改页
    handleUpdate (index, item) {
      this.$router.push({ name: 'permissionUpdate', params: { id: item.sysRoleId, name: item.sysRoleNickname, default: item.listPermission } })
    }
  }
}
</script>

<style lang="scss">
.permission {
  .list {
    padding: 0 19px;
    .el-table .warning-row {
      background: oldlace;
    }
  }
}
</style>
