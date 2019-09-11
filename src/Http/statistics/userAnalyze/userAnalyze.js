import api from './apiGather'
import Http from '../../http'
const http = new Http()
export default {
  getUserAndOrderData (query, success, error) {
    http.get(api.getUserData, query)
      .then(success, error)
  }
}
