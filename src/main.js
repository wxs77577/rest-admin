// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import _ from 'lodash'
import Notifications from 'vue-notification'



// import 'bootstrap/dist/css/bootstrap.css'


import 'font-awesome/css/font-awesome.min.css'
import 'simple-line-icons/css/simple-line-icons.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../scss/style.scss'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Notifications)
axios.defaults.baseURL = 'http://localhost:5555/admin/api/'

Vue.prototype.$http = axios
Vue.prototype._ = global._ = _




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
