import Vuex from 'vuex'
import Vue from 'vue'
/**
 * 引用Vuex
 */
Vue.use(Vuex)
const store = new Vuex.Store({
  // state
  state: {
    username: '',
    authority: [],
    singleUpload: 'http://192.168.3.88:8089/shop/uploadFile',
    multipleUpload: 'http://192.168.3.88:8089/shop/uploadMultipleFiles'
  },
  mutations: {
    setUserName (state, payload) {
      state.username = payload.username
    },
    setUserAuthority (state, payload) {
      state.authority = payload.authority
    }
  },
  getters: {},
  actions: {
    increaseLen (context) {
      return context.commit('setUserName')
    }
  },
  modules: {}
})

export default store
