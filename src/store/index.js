'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import env from '../env'

import modules from './modules'
export {default as types} from './types'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: modules,
  state: {
    config: env,
  },
  getters: {
    
  },
  mutations: {
    
  },
  actions: {

  }
})
