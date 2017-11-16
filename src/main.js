// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import _ from 'lodash'

import Vue from 'vue'
import App from './App'
import router from './router'
import store, {types} from './store'
import http from './http'
import { sync } from 'vuex-router-sync'

import BootstrapVue from 'bootstrap-vue'
import Snotify from 'vue-snotify'

import 'font-awesome/css/font-awesome.min.css'
import 'simple-line-icons/css/simple-line-icons.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../scss/style.scss'

import "vue-snotify/styles/material.css"
Vue.use(Snotify)

import Switch from './components/Switch.vue'
Vue.component('b-switch', Switch)

import FormField from './components/FormField.vue'
Vue.component('b-form-field', FormField)

import DataValue from './components/DataValue.vue'
Vue.component('b-data-value', DataValue)

import FormBuilder from './components/FormBuilder.vue'
Vue.component('b-form-builder', FormBuilder)


Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.prototype.$http = http
Vue.prototype._ = _
sync(store, router)

store.dispatch(types.GET_AUTH)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
