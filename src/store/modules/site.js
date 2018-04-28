import types from '../types'
import menu from '../../menu'
import _ from 'lodash'
import http from '../../http'
import i18n from '../../i18n'

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
    locale: 'en-US',
    locale_switcher: true,
  },
  mutations: {
    [types.SET_SITE](state, data) {
      const { name, description, menu } = data
      for (let k in data) {
        const value = data[k]
        if (typeof value === 'undefined') {
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
        if (data.locale) {
          commit(types.SET_LOCALE, data.locale)
        }
      })
    }
  }
}