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
Vue.use(Snotify)

axios.defaults.baseURL = env.apiUri
axios.interceptors.response.use(response => {
  
  return response;
}, ({ response }) => {
  const {data, status} = response
  
  switch (status) {
    case 422: 
      Vue.prototype.$notify({
        type: 'error',
        title: '验证失败',
        
        text: data.error.message[0].message
      })
      break;
  }
  return Promise.reject(response);
});
Vue.prototype.$http = axios
Vue.prototype._ = global._ = _
Vue.prototype.$config = global.config = env

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
