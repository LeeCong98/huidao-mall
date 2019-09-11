import api from './apiGather'
import Http from '../../http'

const http = new Http()

export default {
  getAll (current, size = 5) {
    const querys = {
      current,
      size
    }
    return http.get(api.all, querys)
  },
  add (params) {
    return http.post(api.add, params)
  },
  addCommodity (params) {
    return http.post(api.addCommodity, params)
  },
  delete (activityId) {
    const querys = {
      activityId
    }
    return http.get(api.delete, querys)
  },
  nameSearch (activityName, current = '1', size = '5') {
    const querys = {
      activityName,
      current,
      size
    }
    return http.get(api.nameSelect, querys)
  },
  updateStatus (activityId, activityStatus) {
    const querys = {
      activityId,
      activityStatus
    }
    return http.get(api.updateStatus, querys)
  },
  idSearch (querys) {
    return http.get(api.idSelect, querys)
  },
  deleteCommodity (itemId) {
    const params = {
      itemId
    }
    return http.post(api.deleteCommodity, params)
  },
  update (params) {
    return http.post(api.update, params)
  },
  getDialogSearch (current, size, itemName, listParent) {
    const querys = {
      current,
      size,
      itemName,
      listParent
    }
    return http.get(api.dialogSearch, querys)
  },
  getAllPX (msg = '', current = '1', size = '5') {
    const querys = {
      msg,
      current,
      size
    }
    return http.get(api.allPX, querys)
  },
  getActivityCategory () {
    http.get(api.getCategory)
      .then(({
        data: {
          data
        }
      }) => {
        this.typeOptions = data.map((item) => {
          item.preferenceItems = item.preferenceItems.map((kid) => {
            return {
              preferenceType: kid.preferenceItemName,
              preferenceId: kid.preferenceItemId
            }
          })
          return item
        })
      }, () => {
        this.$message({
          type: 'error',
          message: '获取分类获取失败'
        })
      })
  },
  goodsSearch (query, success, error) {
    http.get(api.searchGoodsUrl, query)
      .then(success, error)
  }
}
