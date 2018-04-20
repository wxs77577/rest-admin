import types from '../types'
import menu from '../../menu'
import _ from 'lodash'
import http from '../../http'

export default {
  state: {
    name: 'REST ADMIN',
    url: '',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    menu: menu,
    footer: `<span><a href="https://github.com/wxs77577/rest-admin">REST ADMIN</a> &copy; ${new Date().getFullYear()} </span>
    <span class="ml-auto">
      Powered by <a href="https://github.com/wxs77577/rest-admin">REST ADMIN</a>
    </span>`,
    logo: require('@/assets/img/logo.png'),
  },
  mutations: {
    [types.SET_SITE](state, data) {
      const { name, description, menu } = data
      for (let k in data) {
        const value = data[k]
        if (!value) {
          continue
        }
        state[k] = value
      }
    },
  },
  getters: {
    currentMenu(state, getters, rootState) {
      const item = _.find(state.menu, { url: '/rest/' + rootState.route.params.resource }) || {}
      return item
    }
  },
  actions: {
    [types.FETCH_SITE]({ commit }) {
      http.get('site').then(({ data }) => {
        commit(types.SET_SITE, data)
      })
    }
  }
}