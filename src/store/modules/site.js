import types from '../types'
import menu from '../../menu'
import _ from 'lodash'

export default {
  state: {
    name: 'REST ADMIN',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    menu: menu,
    footer: ` <span><a href="https://worthdaily.com">一值</a> &copy; 2017 </span>
    <span class="ml-auto">Powered by <a href="https://worthdaily.com">一值团队</a></span>`,
    logo: require('../../assets/img/logo.png'),
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