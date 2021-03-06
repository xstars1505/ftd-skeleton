import Vue from 'vue';
import axios from 'axios';
import store from '@/store';

import { SERVER_API_URL } from '@/constants/app.constants';

axios.defaults.baseURL = SERVER_API_URL;

axios.interceptors.request.use(function(config) {
  // default options
  //  Loading.show();
  const token =
    localStorage.getItem('authenticationToken') ||
    sessionStorage.getItem('authenticationToken');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
});
axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.commit('logout');
      if (!error.config.url.includes('/logout')) {
        sessionStorage.setItem('requested-url', window.location.pathname);
      }
    }

    return Promise.reject(error);
  }
);

Vue.prototype.axios = axios;
