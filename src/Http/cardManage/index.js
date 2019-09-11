import cardApi from './apiGether'
import HTTP from './../http'
var http = new HTTP()
export default {
  getCardByPageSize (query, success, error) {
    http
      .get(cardApi.byPageSize, {
        current: query.current,
        size: query.size
      })
      .then(success, error)
  },
  getByNameOrStatus (query, success, error) {
    http
      .get(cardApi.byUserNameOrStatus, query)
      .then(success, error)
  },
  changeCardStatus (query, success, error) {
    http.get(cardApi.changeStatus, query)
      .then(success)
      .catch(error)
  },
  removeCardById ({
    id
  }, success, error) {
    http
      .get(cardApi.deleteCard, {
        id: id
      })
      .then(success)
      .catch(error)
  },
  addCustomerCard (cardInfo, success, error) {
    http.post(cardApi.increasecard, cardInfo).then(success, error)
  },
  getOriginInfo (id) {
    http
      .get(cardApi.queryCardById, {
        id: id
      })
      .then(({
        data: {
          data
        }
      }) => {
        if (data.ticketStatus === 'Y') {
          this.$router.go(-1)
        } else {
          this.asignValue(data)
        }
      }, () => {
        this.$message({
          type: 'error',
          message: '卡劵数据请求失败！',
          duration: 1500
        })
      })
  },
  updateCardInfo (cardInfo) {
    http.post(cardApi.updateApi, cardInfo)
      .then(({
        data: {
          data
        }
      }) => {
        this.asignValue(data)
        this.$message({
          type: 'success',
          message: '数据修改成功',
          duration: 1500
        })
      })
      .catch(({
        data: {
          message = '卡劵信息修改失败'
        }
      }) => {
        this.$message({
          type: 'error',
          message: message,
          duration: 1500
        })
      })
  }
}
