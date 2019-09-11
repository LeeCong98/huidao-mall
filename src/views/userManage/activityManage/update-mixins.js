import Activity from './addActivity.vue'

export default {
  data () {
    return {
      mode: 'update',
      list: []
    }
  },
  mixins: [Activity],
  created () {
    if (this.mode === 'update') {
      this.$http.activityManage.idSearch({ activityId: this.$route.params.id }).then(res => {
        this.list = res.data.data[0]
        this.goodsCategoryList = ['请选择分类'].concat(res.data.data.listParents)
        this.dataFill()
      }, () => {
        this.$message({
          type: 'error',
          message: '没有权限访问'
        })
        this.$router.back(-1)
      })
    }
  },
  methods: {
    // 给修改页默认填值
    dataFill () {
      let img = {}
      this.activityName = this.list.activityName
      this.startTime = this.list.startTime
      this.endTime = this.list.endTime
      img.url = this.list.activityImg
      img.name = this.list.activityId
      this.activityRule = this.list.rule
      this.selectedOptions = [this.list.preferenceId, this.list.preferenceItemId]
      this.fileList.push(img)
      this.checkList = this.list.itemInfos
      this.tableData = this.checkList.slice(0, this.pageSize)
    }
  }
}
