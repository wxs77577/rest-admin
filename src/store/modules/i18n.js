import types from '../types'
import _ from 'lodash'

import i18n from '../../i18n'

export default {
  state: {
    locale: null,
  },
  mutations: {
    [types.SET_LOCALE](state, locale) {
      state.locale = locale
      localStorage.setItem('rest_admin_locale', locale)
      i18n.locale = locale
    },
  },
  actions: {
    [types.FETCH_LOCALE]({commit}){
      const cachedLocale = localStorage.getItem('rest_admin_locale')
      if (cachedLocale) {
        
        commit(types.SET_LOCALE, cachedLocale)
      }
    }
  }
}