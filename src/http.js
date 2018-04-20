import Vue from 'vue'
import axios from 'axios'
import store, {types} from './store'
const API_URI = process.env.API_URI || '/admin/api/'
console.log(`API_URI=${API_URI}`)
global.API_URI = API_URI
axios.defaults.baseURL = API_URI
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + store.state.auth.token
  return config
})
axios.interceptors.response.use(response => {

  return response;
}, ({ response }) => {
  const { data, status, statusText } = response
  
  switch (status) {
    case 422:

      break;
    case 401:
      // vm.$snotify.error('请先登录')
      console.log('go login')
      store.dispatch(types.GO_LOGIN)
    case 404:
      Vue.prototype.$snotify.error(String(statusText))
      break;
  }
  let msg = data.message
  if (_.isArray(msg)) {
    msg = msg[0].message
  }
  if (msg) {
    Vue.prototype.$snotify.error(String(msg))
  } else {
    console.error(data)
  }
  return Promise.reject(response);
});

Vue.prototype.$http = axios

export default axios