<template>
  <div class="permissionUpdate root-container">
    <Headline title="权限管理" label="修改权限" class="border" :middleLine="true"></Headline>
    <Content
      :update="name"
      :selectMenu="selectMenu"
      :defaultItem="defaultItem"
      @handleSubmit="onSubmit"
      @handleCancel="onCancel"
    ></Content>
  </div>
</template>

<script>
import Headline from '../../../components/headline.vue'
import Content from '../../../components/options/permission/content.vue'
export default {
  data () {
    return {
      selectMenu: [],
      name: '',
      defaultItem: [],
      id: ''
    }
  },
  methods: {
    // 表单提交
    onSubmit (list) {
      this.$http.Permission.update(list, this.id).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功',
          lockScroll: false
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
  created () {
    this.name = this.$route.params.name
    this.id = this.$route.params.id
    this.defaultItem = this.$route.params.default
    this.$http.Permission.getAllPermission().then(res => {
      this.selectMenu = res.data.data
    }, (err) => {
      this.$message({
        type: 'error',
        message: err.data.message
      })
    })
  },
  components: {
    Headline,
    Content
  }
}
</script>

<style lang="scss" scoped>
</style>
