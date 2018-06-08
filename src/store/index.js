'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
// import env from '../env'

import modules from './modules'
import types from './types'
export { default as types } from './types'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: modules,
  state: {
    downloadUrl: null
  },
  getters: {

  },
  mutations: {
    [types.DOWNLOAD](state, url) {
      state.downloadUrl = ''
      Vue.nextTick(() => {
        this.downloadUrl = url
      })
    }
  },
  actions: {

  }
})
