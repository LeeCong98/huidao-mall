import api from './apiGather'
import Http from './../../http'
const http = new Http()
export default {
  getOrderData (success, error) {
    http.get(api.getOrderData)
      .then(success, error)
  }
}
