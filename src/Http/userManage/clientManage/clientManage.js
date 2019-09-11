import Http from '../../http'
var http = new Http()
export default class getGuestAll extends Http {
  getGuesttAll (
    success,
    error = this.errorFilter
  ) {
    http.get('/selectAll')
      .then(success, error)
  }
  getByMobileGuest (
    mobile,
    success,
    error = this.errorFilter
  ) {
    http.get('/selectByMobile', {
      mobile
    })
      .then(success, error)
  }
  getSwitchPage (data, success, error = this.errorFilter) {
    http.get('/pageHolder', data)
      .then(success, error)
  }
  getUserInfoById (query, success, error) {
    http.get('/selectByPrimaryKey', query)
      .then(success, error)
  }
  updateUserInfo (params, success, error) {
    http.post('/updateByPrimaryKey', params)
      .then(success, error)
  }
  // 切换用户状态
  updateStatus (query, success, error = this.errorFilter) {
    http.get('/Customer/status', query)
      .then(success, error)
  }
  // 頁面錯誤處理
  errorFilter () {

  }
}
