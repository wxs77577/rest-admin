import types from '../types'
import menu from '../../menu'
import _ from 'lodash'

export default {
  state: {
    name: 'REST ADMIN',
    url: 'https://genyii.com',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    menu: menu,
    poweredBy: 'Powered by <a href="https://genyii.com">上海庚易软件科技有限公司</a>',
    footer: '',
    logo: require('@/assets/img/gengyi-logo.svg'),
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
    // [types.FETCH_SITE]({commit}){
    //   http.get('site').then(({data}) => {
    //     commit(types.SET_SITE, data)
    //   })
    // }
  }
}