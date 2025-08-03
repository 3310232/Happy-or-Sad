// src/api/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
});

// 请求拦截器：加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
api.interceptors.response.use(
  (response:any) => {
    return response.data;
  },
  (error:any) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        // 鉴权失败处理
        console.warn('身份过期，请重新登录');
        // 可以跳转登录页 or 弹出提示
      }
      return Promise.reject(response.data);
    } else {
      return Promise.reject({ message: '网络错误' });
    }
  }
);

export default api;
