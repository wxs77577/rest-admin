'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
// import env from '../env'

import modules from './modules'
export {default as types} from './types'

Vue.use(Vuex)

const apiUri = process.env.API_URI || 'http://localhost:5555/admin/api/'
// const apiUri = 'http://localhost:5555/admin/api/'


export default new Vuex.Store({
  modules: modules,
  state: {
    config: {
      apiUri
    },
  },
  getters: {
    
  },
  mutations: {
    
  },
  actions: {

  }
})
