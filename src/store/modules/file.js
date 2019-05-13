import types from '../types'
import http from '../../http'

export default {
  state: {
    locale: null,
  },
  mutations: {
    [types.SHOW_FILE_BROWSER](state, params) {

    },
  },
  actions: {
    async [types.FETCH_ONLINE_FILES]({ commit }) {
      const { data } = await http.get('files', { params: params })
    }
  }
}