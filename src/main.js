// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import Vuex from 'vuex'
import _ from 'lodash'
// import Notifications from 'vue-notification'
import Snotify from 'vue-snotify'
import Vueditor from 'vueditor'
import env from './env'
import nav from './nav'

Vue.use(Vuex)


// import 'bootstrap/dist/css/bootstrap.css'

import 'vueditor/dist/style/vueditor.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'simple-line-icons/css/simple-line-icons.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../scss/style.scss'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
// Vue.use(Notifications)

import "vue-snotify/styles/material.css"
Vue.use(Snotify)

axios.defaults.baseURL = env.apiUri
axios.interceptors.response.use(response => {
  
  return response;
}, ({ response }) => {
  const {data, status} = response
  
  switch (status) {
    case 422: 
      Vue.prototype.$snotify.error(data.error.message[0].message)
      break;
  }
  return Promise.reject(response);
});
Vue.prototype.$http = axios
Vue.prototype._ = global._ = _
Vue.prototype.$config = global.config = env
Vue.prototype.$nav = nav

import Switch from './components/Switch.vue'
Vue.component('b-switch', Switch)

Vue.directive('model2', function (el, binding) {
  el.value
  el.oninput = e => {
    this.$emit('input', e.target.value)
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  methods: {
    getNavItem(url){
      return _.find(this.$nav.items, {url: '/rest/' + url}) || {}
    }
  }
})
