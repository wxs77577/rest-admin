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
      localStorage.setItem('rest_admin_auth', JSON.stringify(data))
    },
  },
  actions: {
    [types.GET_AUTH]({ commit }) {
      let auth = {}
      try {
        auth = JSON.parse(localStorage.getItem('rest_admin_auth') || '{}')
      } catch (e) {
        auth = {
          token: null,
          user: null
        }
      }
      commit(types.SET_AUTH, auth)
    },
    [types.GO_LOGIN](){
      return router.push({
        name: 'login'
      })
    }
  }
}