<template>
  <div class="permissionAdd root-container">
    <Headline title="权限管理" label="新增权限" class="border" :middleLine="true"></Headline>
    <Content :selectMenu="selectMenu" @handleSubmit="onSubmit" @handleCancel="onCancel"></Content>
  </div>
</template>

<script>
import Headline from '../../../components/headline.vue'
import Content from '../../../components/options/permission/content.vue'
export default {
  data () {
    return {
      selectMenu: []
    }
  },
  created () {
    this.$http.Permission.getAllPermission().then(res => {
      this.selectMenu = res.data.data
    }, () => {
      this.$message({
        type: 'error',
        message: '网络异常请重试'
      })
      this.$router.back(-1)
    })
  },
  methods: {
    // 表单提交
    onSubmit (checkList, name) {
      this.$http.Permission.add(checkList, name).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$router.back(-1)
      }, (err) => {
        this.$message({
          type: 'error',
          message: err.data.message
        })
      })
    },
    onCancel () {
      this.$confirm('你确定放弃编辑吗', '警告', {
        confirmButtonText: '返回权限页面',
        cancelButtonText: '继续编辑',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          //
          this.$router.back(-1)
        })
        .catch(() => { })
    }
  },
  components: {
    Headline,
    Content
  }
}
</script>

<style lang="scss" scoped>
</style>
