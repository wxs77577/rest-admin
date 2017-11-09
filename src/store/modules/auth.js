import types from '../types'
import router from '../../router'

export default {
  state: {
    user: null,
    token: null
  },
  mutations: {
    [types.SET_AUTH](state, data) {
      state.user = data.user
      state.token = data.token
      localStorage.setItem('auth', JSON.stringify(data))
    },
  },
  actions: {
    [types.GET_AUTH]({ commit }) {
      let auth = {}
      try {
        auth = JSON.parse(localStorage.getItem('auth')) || {}
      } catch (e) {
        auth = {
          token: null,
          user: null
        }
      }
      commit(types.SET_AUTH, auth)
    },
    [types.GO_LOGIN](){
      console.log('>>> 请先登录');
      return router.push({
        name: 'login'
      })
    }
  }
}