import Vue from 'vue'
import store from './store'

import i18n from './i18n'

import Switch from './components/Switch.vue'
Vue.component('b-switch', Switch)

import FormField from './components/FormField.vue'
Vue.component('b-form-field', FormField)

import DataValue from './components/DataValue.vue'
Vue.component('b-data-value', DataValue)

import FormBuilder from './components/FormBuilder.vue'
Vue.component('b-form-builder', FormBuilder)

import AvatarCropper from "./components/AvatarCropper.vue"
Vue.component('avatar-cropper', AvatarCropper)



export default {
  
}