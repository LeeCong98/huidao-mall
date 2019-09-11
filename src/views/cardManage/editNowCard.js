import editPage from './addNewCard.vue'
import cardModel from './../../Http/cardManage/index'
export default {
  mixins: [editPage],
  created () {
    // 获取页面初始数据
    this.mode = 'edit'
    if (this.$route.query.id !== undefined) {
      this.getOriginInfo(this.$route.query.id)
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    // 获取卡劵原有的数据
    getOriginInfo (id) {
      cardModel.getOriginInfo.call(this, id)
    },
    asignValue (cardinfo) {
      // 数据返显
      this.ruleForm.createdBy = cardinfo.createdBy
      this.ruleForm.ticketTitle = cardinfo.ticketTitle
      this.ruleForm.ticketRule = cardinfo.ticketRule
        .split(',')
        .map(item => parseFloat(item))
      this.ruleForm.datetimeValue = [
        new Date(cardinfo.startTime).getTime(),
        new Date(cardinfo.endTime).getTime()
      ]
      this.ruleForm.preferentialFee = cardinfo.preferentialFee
      this.ruleForm.ticketNum = cardinfo.ticketNum
      this.ruleForm.isEnable = cardinfo.ticketStatus === 'Y'
    },
    // 提交更新
    submitUpdate (newCardInfo) {
      newCardInfo.ticketId = this.$route.query.id
      cardModel.updateCardInfo.call(this, newCardInfo)
    }
  }
}
