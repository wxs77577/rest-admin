import types from '../types'
import nav from '../../nav'
import _ from 'lodash'

export default {
  state: {
    items: nav.items,
  },
  mutations: {
    [types.SET_NAV_ITEMS](state, data) {
      state.items = data
    },
  },
  getters: {
    currentNav(state, getters, rootState){
      const item = _.find(state.items, { url: '/rest/' + rootState.route.params.resource }) || {}
      return item
    }
  },
  actions: {
    
  }
}