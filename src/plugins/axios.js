"use strict";

import Vue from 'vue';
import axios from "axios";
import { Message } from 'element-ui'
import get from 'lodash/get'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.VUE_APP_API || "/api",
  timeout: 3 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    const message = get(error, 'response.data.message', '出错了')
    message && Message.error(message)
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Vue.prototype.$axios = _axios
  Vue.prototype.axios = _axios
  // Object.defineProperties(Vue.prototype, {
  //   axios: {
  //     get() {
  //       return _axios;
  //     }
  //   },
  //   $axios: {
  //     get() {
  //       return _axios;
  //     }
  //   },
  // });
};

Vue.use(Plugin)

export default Plugin;
