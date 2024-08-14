import axios from 'axios'

const instance = axios.create({
  baseURL: '',
  withCredentials: false,
  timeout: 50000,
});
instance.defaults.withCredentials=false;
instance.interceptors.response.use(function (response) {
  return response?.data || response
}, function (error) {
  return Promise.reject(error);
});

export default instance