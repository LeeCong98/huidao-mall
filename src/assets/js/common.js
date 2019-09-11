let warning = 'warning'
let success = 'success'
let error = 'error'
const prompt = {
  'loading': {
    cont: '请等待数据响应'
  },
  'loginSuccess': {
    cont: '登录成功',
    type: success
  },
  'loginError': {
    cont: '信息填写未完整',
    type: error
  },
  'loginFaild': {
    cont: '登录失败!请检查账号信息！',
    type: error
  },
  'registerError': {
    cont: '信息填写出错',
    type: warning
  }
}
/**
 * 提示框封装
 * @param {*} param
 */
function alertInfo (params) {
  if (typeof params === 'string') {
    params = prompt[params]
  }
  // 如果之前已经开启，先进行关闭
  if (alertInfo.backMessage !== undefined) {
    alertInfo.backMessage.close()
    alertInfo.backMessage = undefined
  }
  alertInfo.backMessage = this.$message({
    message: params.cont,
    type: params.type,
    duration: 1500,
    showClose: true
  })
  return false
}

function datetimeFormat () {
  let monthDay = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 30
  }
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1
  let day = new Date().getDate()
  let sevenDay = parseInt(day - 7)
  let sevenMonth = null
  if (sevenDay < 0) {
    sevenDay = Math.abs(monthDay[month - 1] - Math.abs(sevenDay))
    sevenMonth = month - 1
  } else if (sevenDay === 0) {
    sevenDay = 1
  }
  return {
    beginTime: new Date(`${year}-${sevenMonth || month}-${sevenDay}`).getTime(),
    endTime: new Date(`${year}-${month}-${day}`).getTime()
  }
}

function remove (callback) {
  this.$confirm('此操作将永久删除, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      callback()
    })
    .catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}

function examineItem (property) {
  // 判断是否为字符串，注意instanceof不能判断字符类型
  if (this[property] === undefined || this[property] === null) {
    return true
  } else if (typeof this[property] === 'string') {
    return this[property].trim() === ''
    // 判断是否为字符串，注意typeof不能判断数组
  } else if (this[property] instanceof Array) {
    return this[property].length === 0
  } else if (typeof this[property] === 'number') {
    return this[property] === 0
  }
}
/**
 *
 * @param {错误信息的数组，其中成员格式为 this上的属性值为key，错误信息为键} errorInfo
 */
function examineInfoComplete (errorInfo) {
  const len = errorInfo.length
  for (var i = 0; i < len; i++) {
    for (var key in errorInfo[i]) {
      if (examineItem.call(this, key)) {
        // 返回缺失信息
        return errorInfo[i][key]
      }
    }
  }
  return true
}
// 将日期格式化函数
function formatDate (date, fmt) {
  // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export {
  alertInfo,
  remove,
  examineInfoComplete,
  examineItem,
  formatDate,
  datetimeFormat
}
