import types from '../types'
import menu from '../../menu'
import _ from 'lodash'
import http from '../../http'
import Vue from 'vue'
import storage from '../../storage';

export default {
  state: {
    name: '',
    url: '',
    description: '',
    menu: menu,
    currentMenu: {},
    languages: false,
    footer: false,
    theme: '',
    logo: '',
    locale: 'en-US',
    locale_switcher: true,
    login_url: null,
    html: '',
    css: [],
    js: [],
    skin: '',
    header: null,
    grid_style: 1,
    sidebar_userinfo: true,
    page_header: '',
    components: [],
    use_field_apis: true,
    resource_prefix: '',
    fetched: false,
  },
  mutations: {
    [types.SET_SITE](state, data) {
      for (let k in data) {
        const value = data[k]
        if (typeof value === 'undefined') {
          continue
        }
        state[k] = value
      }
      
    },
    
    [types.SET_PAGE_HEADER](state, text) {
      state.page_header = text
    },
    [types.SET_THEME](state, theme){
      state.theme = theme
      const url = `https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.1.3/${state.theme}/bootstrap.min.css`
      document.getElementById('css-skin').href = url
      storage.set('theme', state.theme)
    }
  },
  getters: {
  },
  actions: {
    [types.FETCH_SITE]({ commit, dispatch, state }) {
      http.get('site').then(({ data }) => {
        data.fetched = true
        commit(types.SET_SITE, data)
        if (!state.page_header) {
          // dispatch(types.FETCH_PAGE_HEADER)
        }
        if (state.theme) {
          commit(types.SET_THEME, state.theme)
        }
        if (data.locale) {
          commit(types.SET_LOCALE, data.locale)
        }
        
      })
    },
    [types.FETCH_PAGE_HEADER]({commit, state, rootState}) {
      return
      let url = rootState.route.path
      let menu = _.find(state.menu, { url }) || {}
      if (!menu.name && url.indexOf('/rest/') > -1) {
        url = url.match(/(\/rest\/\w+)/).pop()
        menu = _.find(state.menu, { url }) || {}
      }
      commit(types.SET_PAGE_HEADER, menu.name || '')
    },
    
  }
}