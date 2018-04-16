import Vue from 'vue'
import axios from 'axios'
import store, {types} from './store'
const API_URI = process.env.apiUri || 'http://localhost:5555/admin/api/'
global.API_URI = API_URI
axios.defaults.baseURL = API_URI
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + store.state.auth.token
  return config
})
axios.interceptors.response.use(response => {

  return response;
}, ({ response }) => {
  const { data, status } = response
  
  switch (status) {
    case 422:

      break;
    case 401:
      // vm.$snotify.error('请先登录')
      store.dispatch(types.GO_LOGIN)
      
      break;
  }
  let msg = data.message
  if (_.isArray(msg)) {
    msg = msg[0].message
  }
  Vue.prototype.$snotify.error(msg)
  return Promise.reject(response);
});

export default axios